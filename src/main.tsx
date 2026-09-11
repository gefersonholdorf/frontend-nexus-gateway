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
import { ForbiddenPage } from './pages/forbidden-page.tsx'
import { IpMapPage } from './pages/ip-map.tsx'
import { LoginPage } from './pages/login.tsx'
import OrganogramaPage from "./pages/organograma-page.tsx"
import { ProfilesUpdatedPage } from './pages/profile-updated-page.tsx'
import { ProfilePage } from './pages/profiles-page.tsx'
import { SecurityCenterPage } from './pages/security-center.tsx'
import { ServersPage } from './pages/servers-page.tsx'
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
import { CampaignActiveProvider } from "./contexts/campaign-active.tsx"
import { DocumentsProfilePage } from "./pages/documents/profile-page.tsx"
import { CreateDocumentPage } from "./pages/documents/create-document.tsx"
import { ReviewsDocumentPage } from "./pages/documents/reviews-page.tsx"
import { DocumentsSettingsPage } from "./pages/documents/documents-settings-page.tsx"
import { DocumentsPage } from "./pages/documents/documents-page.tsx"
import { ReviewDetailsDocumentPage } from "./pages/documents/review-details-page.tsx"
import { PermissionProvider } from "./modules/providers/permission-provider.tsx"
import { CoreAuditPage } from "./modules/core/pages/core-audit-page.tsx"
import { CoreHomePage } from "./modules/core/pages/core-home-page.tsx"
import { CoreIntegrationsPage } from "./modules/core/pages/core-integrations-page.tsx"
import { CoreModulesPage } from "./modules/core/pages/core-modules-page.tsx"
import CoreModuleDetailPage from "./modules/core/pages/core-module-detail-page.tsx"
import { CorePermissionsPage } from "./modules/core/pages/core-permissions-page.tsx"
import { CoreRolesPage } from "./modules/core/pages/core-roles-page.tsx"
import { CoreUsersPage } from "./modules/core/pages/core-users-page.tsx"
import { HubServicesPage } from "./modules/hub-services/pages/hub-services-page.tsx"
import { RouteGuard } from "./modules/auth/components/route-guard.tsx"
import { DocumentosPage } from "./modules/documentos/pages/documentos-page.tsx"
import { DocumentoDetailPage } from "./modules/documentos/pages/documento-detail-page.tsx"
import { RevisoesPage } from "./modules/documentos/pages/revisoes-page.tsx"
import { VersoesPage } from "./modules/documentos/pages/versoes-page.tsx"
import { AprovacoesPendentesPage } from "./modules/documentos/pages/aprovacoes-pendentes-page.tsx"
import { CategoriasPage } from "./modules/documentos/pages/configuracoes/categorias-page.tsx"
import { AreasPage } from "./modules/documentos/pages/configuracoes/areas-page.tsx"
import { FluxosPage } from "./modules/documentos/pages/configuracoes/fluxos-page.tsx"
import { PeriodoRevisaoPage } from "./modules/documentos/pages/configuracoes/periodo-revisao-page.tsx"

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
              <PermissionProvider>
                <CampaignActiveProvider>
                  <RootLayout>
                    <Routes>
                      <Route path="/" element={<LoginPage />} />
                      <Route path="/403" element={<ForbiddenPage />} />
                      <Route element={<ProtectedRoute />}>
                        <Route element={<LayoutPages />}>
                          <Route path="/welcome" element={<WelcomePage />} />
                          <Route path="/ipmap" element={<IpMapPage />} />
                          <Route path="/security-center" element={<SecurityCenterPage />} />
                          <Route path="/hub-services" element={<HubServicesPage />} />
                          <Route path="/calendar" element={<CalendarPage />} />
                          <Route path="/servers" element={<ServersPage />} />
                          <Route path="/comunications" element={<CommunicationsPage />} />
                          <Route path="/documents" element={<DocumentsPage />} />
                          {/* <Route path="/documents/:id" element={<DocumentDetailPage documentId={1} currentUserId={1} />} /> */}
                          <Route path="/documents/profiles" element={<DocumentsProfilePage />} />
                          <Route path="/documents/create" element={<CreateDocumentPage />} />
                          <Route path="/documents/configurations" element={<DocumentsSettingsPage />} />
                          <Route path="/documents/reviews" element={<ReviewsDocumentPage />} />
                          <Route path="/documents/reviews/:id" element={<ReviewDetailsDocumentPage />} />
                          <Route path="/documents/events" element={<DocumentsChartsPage />} />
                          <Route path="/core" element={<CoreHomePage />} />
                          <Route path="/core/users" element={<CoreUsersPage />} />
                          <Route path="/core/roles" element={<CoreRolesPage />} />
                          <Route path="/core/permissions" element={<CorePermissionsPage />} />
                          <Route path="/core/modules" element={<CoreModulesPage />} />
                          <Route path="/core/modules/:id" element={<CoreModuleDetailPage />} />
                          <Route path="/core/integrations" element={<CoreIntegrationsPage />} />
                          <Route path="/core/audit" element={<CoreAuditPage />} />

                          {/* Gestão de Documentos — módulo novo, independente do legado
                              "Documentos ISO" em /documents (src/pages/documents, intocado).
                              Visibilidade de documento/revisão/versão é por role (RF004),
                              não por permission — por isso estas telas de navegação/leitura
                              não usam RouteGuard, só ProtectedRoute (autenticação). Ações
                              sensíveis dentro delas já ficam atrás de <Can permission="...">. */}
                          <Route path="/gestao-documentos" element={<DocumentosPage />} />
                          <Route path="/gestao-documentos/revisoes" element={<RevisoesPage />} />
                          <Route path="/gestao-documentos/versoes" element={<VersoesPage />} />
                          <Route path="/gestao-documentos/:id" element={<DocumentoDetailPage />} />
                          <Route
                            path="/gestao-documentos/aprovacoes-pendentes"
                            element={
                              <RouteGuard permission="aprovacao.avaliar">
                                <AprovacoesPendentesPage />
                              </RouteGuard>
                            }
                          />
                          <Route
                            path="/gestao-documentos/configuracoes/categorias"
                            element={
                              <RouteGuard permission="configuracoes.gerenciar">
                                <CategoriasPage />
                              </RouteGuard>
                            }
                          />
                          <Route
                            path="/gestao-documentos/configuracoes/areas"
                            element={
                              <RouteGuard permission="configuracoes.gerenciar">
                                <AreasPage />
                              </RouteGuard>
                            }
                          />
                          <Route
                            path="/gestao-documentos/configuracoes/fluxos"
                            element={
                              <RouteGuard permission="configuracoes.gerenciar">
                                <FluxosPage />
                              </RouteGuard>
                            }
                          />
                          <Route
                            path="/gestao-documentos/configuracoes/periodo-revisao"
                            element={
                              <RouteGuard permission="configuracoes.gerenciar">
                                <PeriodoRevisaoPage />
                              </RouteGuard>
                            }
                          />

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
                </CampaignActiveProvider>
                <LoginExpiredModal />
              </PermissionProvider>
            </LoginExpiredProvider>
            {/* </OperationsProvider> */}
          </UserProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode >,
)
