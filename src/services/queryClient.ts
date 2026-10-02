import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // or false if you prefer
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes (previously cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;