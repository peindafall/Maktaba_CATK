import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');
export const API_BASE_URL = BASE_URL;

export const ACCESS_KEY = 'access_token';
export const REFRESH_KEY = 'refresh_token';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh?: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  // ⚠️ Avant : localStorage.clear() effaçait AUSSI la langue et le thème choisis.
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 70_000, // Render gratuit peut mettre ~50 s à se réveiller
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number; _slowTimer?: number };

// --- Indicateur « le serveur se réveille » (requête > 4 s) ---
let slowRequests = 0;
const markSlow = (config: RetriableConfig) => {
  config._slowTimer = window.setTimeout(() => {
    slowRequests += 1;
    useUIStore.getState().setServerWaking(true);
    config._slowTimer = -1;
  }, 4000);
};
const unmarkSlow = (config?: RetriableConfig) => {
  if (!config) return;
  if (config._slowTimer === -1) {
    slowRequests = Math.max(0, slowRequests - 1);
    if (slowRequests === 0) useUIStore.getState().setServerWaking(false);
  } else if (config._slowTimer) {
    clearTimeout(config._slowTimer);
  }
  config._slowTimer = undefined;
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const lang = localStorage.getItem('i18nextLng');
  if (lang) config.headers['Accept-Language'] = lang.split('-')[0];
  markSlow(config as RetriableConfig);
  return config;
});

// --- Rafraîchissement du token : une seule requête même si 5 appels échouent en même temps ---
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh }, { timeout: 70_000 });
    tokenStorage.set(data.access, data.refresh); // ROTATE_REFRESH_TOKENS : nouveau refresh renvoyé
    return data.access as string;
  } catch {
    return null;
  }
};

const isAuthEndpoint = (url?: string) => !!url && /\/auth\/(login|register|refresh|logout)\//.test(url);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

api.interceptors.response.use(
  (response) => {
    unmarkSlow(response.config as RetriableConfig);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    unmarkSlow(config);
    if (!config) return Promise.reject(error);

    const status = error.response?.status;

    // 1) Token expiré -> on tente un refresh puis on rejoue la requête
    if (status === 401 && !config._retry && !isAuthEndpoint(config.url) && tokenStorage.getRefresh()) {
      config._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken().finally(() => (refreshPromise = null));
      const newAccess = await refreshPromise;
      if (newAccess) {
        config.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(config);
      }
      // Session expirée : on déconnecte proprement, sans recharger la page
      tokenStorage.clear();
      useAuthStore.getState().logout();
      delete config.headers.Authorization;
      return api.request(config); // la plupart des pages sont publiques : on réessaie en anonyme
    }

    // 2) Serveur endormi / redémarrage (Render) : on réessaie les GET jusqu'à 2 fois
    const isGet = (config.method || 'get').toLowerCase() === 'get';
    const transient = !error.response || status === 502 || status === 503 || status === 504;
    if (isGet && transient && (config._retryCount ?? 0) < 2) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      await sleep(1500 * config._retryCount);
      return api.request(config);
    }

    return Promise.reject(error);
  }
);

/** Ping léger pour réveiller le backend dès l'ouverture du site (avant les vraies requêtes). */
export const warmUpServer = () => {
  axios.get(`${BASE_URL}/health/`, { timeout: 70_000 }).catch(() => {});
};

/** Extrait un message d'erreur lisible d'une réponse DRF. */
export const extractApiErrors = (err: unknown): Record<string, string[]> & { _status?: never } => {
  const e = err as AxiosError<unknown>;
  const data = e?.response?.data;
  if (!data) return { non_field_errors: ['__network__'] };
  if (typeof data === 'string') return { non_field_errors: ['__server__'] };
  const out: Record<string, string[]> = {};
  Object.entries(data as Record<string, unknown>).forEach(([k, v]) => {
    out[k] = Array.isArray(v) ? v.map(String) : [String(v)];
  });
  return out;
};
