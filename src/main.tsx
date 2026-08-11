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
import { ForbiddenPage } from './pages/forbidden-page.tsx'
import { IpMapPage } from './pages/ip-map.tsx'
import { LoginPage } from './pages/login.tsx'
import OrganogramaPage from "./pages/organograma-page.tsx"
import { ProfilesUpdatedPage } from './pages/profile-updated-page.tsx'
import { ProfilePage } from './pages/profiles-page.tsx'
import { SecurityCenterPage } from './pages/security-center.tsx'
import { ServersPage } from './pages/servers-page.tsx'
import { ServicesPage } from './pages/services-page.tsx'
import { SystemsPage } from './pages/systems.tsx'
import { WelcomePage } from './pages/welcome.tsx'
import { ProtectedRoute } from './protected-router.tsx'
import { ScrollToTop } from "./scroll-to-top.tsx"
// import { UsersPage } from "./pages/users-page.tsx"
import { DocumentsChartsPage } from "./pages/documents-charts-page.tsx"
// import { BackupsRestoresPages } from "./pages/backups-restores-page.tsx"
// import { OperationsProvider } from "./components/nexus-operations/contexts/operations-context.tsx"
import { LoginExpiredModal, LoginExpiredProvider } from "./contexts/login-expired.tsx"
import { CampaignsPage } from "./pages/campaigns-page.tsx"
import { MaskingPage } from "./pages/masking-page.tsx"
import { OperationsCenterPage } from "./pages/operations-center-page.tsx"
import { TicketsCenterPage } from "./pages/tickets-center-page.tsx"
import { TicketsValidationPendingsPage } from "./pages/tickets-validation-pendings-page.tsx"
import { CampaignNotificationModal } from "./contexts/campaign-active.tsx"
import type { Campaign } from "./api/campaigns/fetch-campaigns.tsx"

const campaign: Campaign = {
    id: 2,
    code: "CAMP-2026-07",
    title: "Campanha de Julho",
    description: "Orientações e materiais importantes sobre Segurança da Informação para todos os colaboradores.",
    monthYear: "2026-07",
    publishDate: "2026-07-01T08:00:00.000Z",
    status: "PUBLISHED",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BBC7A6300-171D-4040-8A2E-FCA4CEC3674B%7D&file=MAN%20SGSI%20001%20-%20Manual%20da%20Seguran%C3%A7a%20da%20Informa%C3%A7%C3%A3o%20para%20Usu%C3%A1rio.docx&action=default&mobileredirect=true",
    accessStats: {
        total: 6,
        accessed: 3,
        viewed: 5,
        pending: 1,
        ignored: 0,
        accessRate: 50
    },
    responsible: {
        id: 1,
        name: "Geferson Holdorf",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_geferson.PNG",
        email: "geferson@lusati.com.br"
    },
    createdAt: "2026-06-30T14:30:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z",
    createdBy: "Geferson Holdorf"
};

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <UserProvider>
            {/* <OperationsProvider> */}
            <LoginExpiredProvider>
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
                      <Route path="/documents/events" element={<DocumentsChartsPage />} />
                      {/* <Route path="/users" element={<UsersPage />} /> */}
                      <Route path="/profiles" element={<ProfilePage />} />
                      <Route path="/profiles/:id" element={<ProfilesUpdatedPage />} />
                      <Route path="/profiles/create" element={<ProfilesUpdatedPage />} />
                      <Route path="/organograma" element={<OrganogramaPage />} />
                      {/* <Route path="/backups" element={<BackupsRestoresPages />} /> */}
                      <Route path="/masking" element={<MaskingPage />} />
                      <Route path="/tickets-validations-pendings" element={<TicketsValidationPendingsPage />} />
                      <Route path="/operations" element={<OperationsCenterPage />} />
                      <Route path="/tickets" element={<TicketsCenterPage />} />
                      <Route path="/campaigns" element={<CampaignsPage />} />
                    </Route>
                  </Route>
                </Routes>
              </RootLayout>
              <CampaignNotificationModal campaign={campaign} onAccess={() => {}} onDismiss={() => {}} />
              <LoginExpiredModal />
            </LoginExpiredProvider>
            {/* </OperationsProvider> */}
          </UserProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
