import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Branch, Notification } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface AppState {
  // Navigation
  sidebarOpen: boolean;
  currentBranch: Branch | null;
  
  // Theme and locale
  theme: 'light' | 'dark' | 'system';
  locale: 'pt-BR' | 'es' | 'en';
  
  // Offline state
  isOnline: boolean;
  syncInProgress: boolean;
  pendingSyncCount: number;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
}

interface AppActions {
  // Navigation
  setSidebarOpen: (open: boolean) => void;
  setCurrentBranch: (branch: Branch | null) => void;
  
  // Theme and locale
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLocale: (locale: 'pt-BR' | 'es' | 'en') => void;
  
  // Offline state
  setOnlineStatus: (online: boolean) => void;
  setSyncInProgress: (syncing: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  
  // Notifications
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

// Store de autenticação (persistido)
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'casa-branca-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Store da aplicação (persistido)
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // Navigation
      sidebarOpen: false,
      currentBranch: null,
      
      // Theme and locale
      theme: 'system',
      locale: 'pt-BR',
      
      // Offline state
      isOnline: true,
      syncInProgress: false,
      pendingSyncCount: 0,
      
      // Notifications
      notifications: [],
      unreadCount: 0,
      
      // Actions
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setCurrentBranch: (currentBranch) => set({ currentBranch }),
      
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      
      setOnlineStatus: (isOnline) => set({ isOnline }),
      setSyncInProgress: (syncInProgress) => set({ syncInProgress }),
      setPendingSyncCount: (pendingSyncCount) => set({ pendingSyncCount }),
      
      addNotification: (notification) => {
        const notifications = [...get().notifications, notification];
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
      
      removeNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
      
      markAsRead: (id) => {
        const notifications = get().notifications.map(n => 
          n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
        );
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
      
      markAllAsRead: () => {
        const notifications = get().notifications.map(n => ({ 
          ...n, 
          isRead: true, 
          readAt: n.readAt || new Date() 
        }));
        set({ notifications, unreadCount: 0 });
      },
      
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
    }),
    {
      name: 'casa-branca-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme, 
        locale: state.locale,
        currentBranch: state.currentBranch 
      }),
    }
  )
);

// Store para gerenciamento de permissões (não persistido)
interface PermissionsState {
  permissions: Record<string, boolean>;
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
  setPermissions: (permissions: Record<string, boolean>) => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: {},
  
  hasPermission: (resource, action) => {
    const permissions = get().permissions;
    const key = `${resource}.${action}`;
    return permissions[key] === true;
  },
  
  setPermissions: (permissions) => set({ permissions }),
}));

// Store para cache de dados offline (não persistido)
interface OfflineState {
  cachedData: Record<string, any>;
  pendingMutations: Array<{
    id: string;
    type: 'create' | 'update' | 'delete';
    resource: string;
    data: any;
    timestamp: Date;
  }>;
}

interface OfflineActions {
  setCachedData: (key: string, data: any) => void;
  getCachedData: (key: string) => any;
  addPendingMutation: (mutation: any) => void;
  removePendingMutation: (id: string) => void;
  clearPendingMutations: () => void;
}

export const useOfflineStore = create<OfflineState & OfflineActions>((set, get) => ({
  cachedData: {},
  pendingMutations: [],
  
  setCachedData: (key, data) => {
    const cachedData = { ...get().cachedData, [key]: data };
    set({ cachedData });
  },
  
  getCachedData: (key) => {
    return get().cachedData[key];
  },
  
  addPendingMutation: (mutation) => {
    const pendingMutations = [...get().pendingMutations, mutation];
    set({ pendingMutations });
  },
  
  removePendingMutation: (id) => {
    const pendingMutations = get().pendingMutations.filter(m => m.id !== id);
    set({ pendingMutations });
  },
  
  clearPendingMutations: () => {
    set({ pendingMutations: [] });
  },
}));
