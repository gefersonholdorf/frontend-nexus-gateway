import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import './index.css'
import RootLayout from './layout.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import { LayoutPages } from './layout-pages.tsx'
import { Welcome } from './pages/welcome.tsx'
import { IpMapPage } from './pages/ip-map.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route element={<LayoutPages />}>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/ipmap" element={<IpMapPage />} />
            </Route>
            <Route path="/" element={<App />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
