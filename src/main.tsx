import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ServicesPage } from './pages/app.tsx'
import './index.css'
import RootLayout from './layout.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import { LayoutPages } from './layout-pages.tsx'
import { WelcomePage } from './pages/welcome.tsx'
import { IpMapPage } from './pages/ip-map.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from './pages/login.tsx'
import { SecurityCenterPage } from './pages/security-center.tsx'
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<LayoutPages />}>
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/ipmap" element={<IpMapPage />} />
              <Route path="/security-center" element={<SecurityCenterPage />} />
            </Route>
            <Route path="/services" element={<ServicesPage />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
