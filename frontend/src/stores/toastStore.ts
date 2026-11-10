import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...toast, id }] }));
    window.setTimeout(() => get().dismiss(id), toast.duration ?? 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Raccourci utilisable hors composants React. */
export const toast = {
  success: (message: string, extra?: Partial<Toast>) => useToastStore.getState().show({ kind: 'success', message, ...extra }),
  error: (message: string, extra?: Partial<Toast>) => useToastStore.getState().show({ kind: 'error', message, ...extra }),
  info: (message: string, extra?: Partial<Toast>) => useToastStore.getState().show({ kind: 'info', message, ...extra }),
};
