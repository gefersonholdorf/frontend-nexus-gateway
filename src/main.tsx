import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router"
import { ThemeProvider } from './contexts/theme-context.tsx'
import { UserProvider } from './contexts/user-context.tsx'
import './index.css'
import { LayoutPages } from './layout-pages.tsx'
import RootLayout from './layout.tsx'
import { CalendarPage } from './pages/calendar-page.tsx'
import { CommunicationsPage } from './pages/comunications-page.tsx'
import { DocumentsPage } from './pages/documents-page.tsx'
import { EditProfilePage } from './pages/edit-profile-page.tsx'
import { ForbiddenPage } from './pages/forbidden-page.tsx'
import { IpMapPage } from './pages/ip-map.tsx'
import { LoginPage } from './pages/login.tsx'
import { ProfilePage } from './pages/profiles-page.tsx'
import { SecurityCenterPage } from './pages/security-center.tsx'
import { ServersPage } from './pages/servers-page.tsx'
import { ServicesPage } from './pages/services-page.tsx'
import { SystemsPage } from './pages/systems.tsx'
import { WelcomePage } from './pages/welcome.tsx'
import { ProtectedRoute } from './protected-router.tsx'

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
                <Route path="/403" element={<ForbiddenPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<LayoutPages />}>
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/ipmap" element={<IpMapPage />} />
                    <Route path="/security-center" element={<SecurityCenterPage />} />
                    <Route path="/systems" element={<SystemsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/servers" element={<ServersPage />} />
                    <Route path="/comunications" element={<CommunicationsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    {/* <Route path="/users" element={<UsersPage />} /> */}
                    <Route path="/profiles" element={<ProfilePage />} />
                    <Route path="/profiles/:id" element={<EditProfilePage />} />
                  </Route>
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
