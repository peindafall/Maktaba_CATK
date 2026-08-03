import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode;
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: next };
        }),
      setDarkMode: (value) => {
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: value });
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    { name: 'catk-ui-storage', partialize: (state) => ({ isDarkMode: state.isDarkMode }) }
  )
);
