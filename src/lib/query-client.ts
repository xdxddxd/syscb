import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configurações para offline-first
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 60 * 24, // 24 horas (anteriormente cacheTime)
      retry: (failureCount, error: any) => {
        // Não retentar em erros 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Habilitar refetch em foco da janela
      refetchOnWindowFocus: true,
      // Habilitar refetch quando a conexão for restaurada
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Não retentar mutations em erros 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Configurações específicas para queries que precisam de sincronização constante
export const SYNC_QUERY_OPTIONS = {
  staleTime: 1000 * 30, // 30 segundos
  refetchInterval: 1000 * 60, // 1 minuto
  refetchIntervalInBackground: true,
};

// Configurações para dados que mudam raramente
export const STATIC_QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 60, // 1 hora
  gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
};

// Keys para queries organizadas por módulo
export const QUERY_KEYS = {
  USERS: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.USERS.all, 'list'] as const,
    list: (filters: any) => [...QUERY_KEYS.USERS.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.USERS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.USERS.details(), id] as const,
  },
  PROPERTIES: {
    all: ['properties'] as const,
    lists: () => [...QUERY_KEYS.PROPERTIES.all, 'list'] as const,
    list: (filters: any) => [...QUERY_KEYS.PROPERTIES.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.PROPERTIES.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.PROPERTIES.details(), id] as const,
  },
  LEADS: {
    all: ['leads'] as const,
    lists: () => [...QUERY_KEYS.LEADS.all, 'list'] as const,
    list: (filters: any) => [...QUERY_KEYS.LEADS.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.LEADS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.LEADS.details(), id] as const,
  },
  CONTRACTS: {
    all: ['contracts'] as const,
    lists: () => [...QUERY_KEYS.CONTRACTS.all, 'list'] as const,
    list: (filters: any) => [...QUERY_KEYS.CONTRACTS.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.CONTRACTS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.CONTRACTS.details(), id] as const,
  },
  INVENTORY: {
    all: ['inventory'] as const,
    items: () => [...QUERY_KEYS.INVENTORY.all, 'items'] as const,
    item: (id: string) => [...QUERY_KEYS.INVENTORY.items(), id] as const,
    transfers: () => [...QUERY_KEYS.INVENTORY.all, 'transfers'] as const,
    transfer: (id: string) => [...QUERY_KEYS.INVENTORY.transfers(), id] as const,
  },
  FINANCIAL: {
    all: ['financial'] as const,
    records: () => [...QUERY_KEYS.FINANCIAL.all, 'records'] as const,
    dashboard: () => [...QUERY_KEYS.FINANCIAL.all, 'dashboard'] as const,
    commissions: () => [...QUERY_KEYS.FINANCIAL.all, 'commissions'] as const,
  },
  NOTIFICATIONS: {
    all: ['notifications'] as const,
    list: (userId: string) => [...QUERY_KEYS.NOTIFICATIONS.all, userId] as const,
  },
  BRANCHES: {
    all: ['branches'] as const,
    list: () => [...QUERY_KEYS.BRANCHES.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.BRANCHES.all, id] as const,
  },
  MARKET_ANALYSIS: {
    all: ['market-analysis'] as const,
    trends: () => [...QUERY_KEYS.MARKET_ANALYSIS.all, 'trends'] as const,
    comparison: (filters: any) => [...QUERY_KEYS.MARKET_ANALYSIS.all, 'comparison', { filters }] as const,
  }
} as const;
