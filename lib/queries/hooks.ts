import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';

// Types
export interface ApiError {
  message: string;
  statusCode: number;
}

// Generic API fetcher
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await axios.get<T>(url);
  return response.data;
};

// Generic API mutator
export const mutator = async <T, D>({
  url,
  method = 'POST',
  data,
}: {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: D;
}): Promise<T> => {
  const response = await axios({ url, method, data });
  return response.data;
};

// Query keys factory
export const queryKeys = {
  all: ['api'] as const,
  
  users: {
    all: ['api', 'users'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string | number) => 
      [...queryKeys.users.all, 'detail', id] as const,
  },
  
  products: {
    all: ['api', 'products'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.products.all, 'list', filters] as const,
    detail: (id: string | number) => 
      [...queryKeys.products.all, 'detail', id] as const,
  },
  
  orders: {
    all: ['api', 'orders'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.orders.all, 'list', filters] as const,
    detail: (id: string | number) => 
      [...queryKeys.orders.all, 'detail', id] as const,
  },
};

// User hooks
export function useUsers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => fetcher<any[]>('/api/users'),
  });
}

export function useUser(id: string | number, options?: Omit<UseQueryOptions<any, ApiError>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => fetcher<any>(`/api/users/${id}`),
    ...options,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => mutator({ url: '/api/users', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser(id: string | number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => 
      mutator({ url: `/api/users/${id}`, method: 'PUT', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => 
      mutator({ url: `/api/users/${id}`, method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

// Product hooks
export function useProducts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetcher<any[]>('/api/products'),
  });
}

export function useProduct(id: string | number, options?: Omit<UseQueryOptions<any, ApiError>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => fetcher<any>(`/api/products/${id}`),
    ...options,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => mutator({ url: '/api/products', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct(id: string | number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => 
      mutator({ url: `/api/products/${id}`, method: 'PUT', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => 
      mutator({ url: `/api/products/${id}`, method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

// Orders hooks
export function useOrders(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => fetcher<any[]>('/api/orders'),
  });
}

export function useOrder(id: string | number, options?: Omit<UseQueryOptions<any, ApiError>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => fetcher<any>(`/api/orders/${id}`),
    ...options,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => mutator({ url: '/api/orders', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

// Generic optimistic update helper
export function useOptimisticUpdate<T>(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  
  return {
    onMutate: async (newData: T) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newData);
      return { previousData };
    },
    onError: (_error: unknown, _variables: unknown, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
