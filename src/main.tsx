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
import { CalendarPage } from './pages/calendar-page.tsx'
import { UserProvider } from './contexts/user-context.tsx'
import { ThemeProvider } from './contexts/theme-context.tsx'
import { ServersPage } from './pages/servers-page.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <UserProvider>
            <RootLayout>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<LayoutPages />}>
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/ipmap" element={<IpMapPage />} />
                  <Route path="/security-center" element={<SecurityCenterPage />} />
                  <Route path="/systems" element={<SystemsPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/servers" element={<ServersPage />} />
                </Route>
              </Routes>
            </RootLayout>
          </UserProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
