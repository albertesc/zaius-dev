// kit:if backend
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// kit:end
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import '@/i18n/i18n'
// kit:if backend
import { queryClientConfig } from '@/queryClient.config'
// kit:end
import { rootRoutes } from '@/router/rootRoutes'

const root = document.getElementById('root')
// kit:if backend
const queryClient = new QueryClient(queryClientConfig)
// kit:end
const router = createBrowserRouter(rootRoutes)

if (root) {
  createRoot(root).render(
    <StrictMode>
      // kit:if backend
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      // kit:else
      <RouterProvider router={router} />
      // kit:end
    </StrictMode>,
  )
}
