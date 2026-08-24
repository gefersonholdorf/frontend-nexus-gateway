import { Settings } from "lucide-react";

import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/user-context";
import { DocumentTypesTab } from "@/components/documents/configuration/document-types-tab";
import { PeriodicitiesTab } from "@/components/documents/configuration/periodicities-tab";
import { CategoriesTab } from "@/components/documents/configuration/categories-tab";

export function DocumentsSettingsPage() {
    const { user } = useUser();
    const canManage = user?.roles.includes("Administrador") ?? false;

    return (
        <>
            <HeaderPage
                title="Configurações"
                description="Administre tipos, categorias e periodicidades do módulo de Gestão de Documentos."
                icon={Settings}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/documents">Documentos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Configurações</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 px-16 pb-8 space-y-6">
                <Tabs defaultValue="types" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="types">Tipos de Documentos</TabsTrigger>
                        <TabsTrigger value="categories">Categorias</TabsTrigger>
                        <TabsTrigger value="periodicities">Periodicidades</TabsTrigger>
                    </TabsList>

                    <TabsContent value="types">
                        <DocumentTypesTab canManage={canManage} />
                    </TabsContent>

                    <TabsContent value="categories">
                        <CategoriesTab canManage={canManage} />
                    </TabsContent>

                    <TabsContent value="periodicities">
                        <PeriodicitiesTab canManage={canManage} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}