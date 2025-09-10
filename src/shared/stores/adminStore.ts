import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AdminStore {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin1234!'
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      adminUser: null,
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          const adminUser: AdminUser = {
            id: 'admin-1',
            username: 'admin',
            isAdmin: true
          };
          
          set({
            adminUser,
            isAuthenticated: true
          });
          
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          adminUser: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
