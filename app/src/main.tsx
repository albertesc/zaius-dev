import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
// kit:if i18n
import '@/i18n/i18n'
// kit:end
import { queryClientConfig } from '@/queryClient.config'
import { rootRoutes } from '@/router/rootRoutes'

const root = document.getElementById('root')
const queryClient = new QueryClient(queryClientConfig)
const router = createBrowserRouter(rootRoutes)

if (root) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
