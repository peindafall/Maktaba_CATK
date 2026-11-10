import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  serverWaking: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setServerWaking: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: true, // mode sombre par défaut
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      serverWaking: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value: boolean) => set({ isDarkMode: value }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      setServerWaking: (value) => set({ serverWaking: value }),
    }),
    {
      name: 'catk-ui-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
