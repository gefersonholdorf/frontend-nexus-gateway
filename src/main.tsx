import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ServicesPage } from './pages/services-page.tsx'
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
import { SystemsPage } from './pages/systems.tsx'
import { IncidentsPage } from './pages/incidents-page.tsx'
import { CalendarPage } from './pages/calendar-page.tsx'

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
              <Route path="/systems" element={<SystemsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
            </Route>
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
