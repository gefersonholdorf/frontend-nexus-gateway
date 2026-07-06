import {
    Background,
    ReactFlow,
    type Edge,
    type Node
} from "@xyflow/react";

import { HeaderPage } from "@/components/header-page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useTheme } from "@/contexts/theme-context";
import "@xyflow/react/dist/style.css";
import { Building2 } from "lucide-react";
import EmployeeNode from "../components/employee";

const nodeTypes = {
    employee: EmployeeNode,
};

const nodes: Node[] = [
    {
        id: "roberto",
        type: "employee",
        position: { x: 550, y: 0 },
        data: {
            name: "Roberto Amorim",
            role: "CEO | CTO | Founder",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_roberto.PNG',
        },
    },

    {
        id: "marcelo",
        type: "employee",
        position: { x: 550, y: 180 },
        data: {
            name: "Marcelo Verdi",
            role: "COO | CPO | Co-Founder",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_marcelo.PNG',
        },
    },

    {
        id: "roberto-dev",
        type: "employee",
        position: { x: 20, y: 420 },
        data: {
            name: "Roberto Amorim",
            role: "Analista Fullstack Senior",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_roberto.PNG',
        },
    },

    {
        id: "leandro",
        type: "employee",
        position: { x: 230, y: 420 },
        data: {
            name: "Leandro",
            role: "Desenvolvedor Pleno III",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_leandro.PNG',
        },
    },

    {
        id: "vitor",
        type: "employee",
        position: { x: 440, y: 420 },
        data: {
            name: "Vitor",
            role: "Desenvolvedor Pleno II",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_vitor.PNG',
        },
    },

    {
        id: "geferson",
        type: "employee",
        position: { x: 690, y: 420 },
        data: {
            name: "Geferson",
            role: "Analista Suporte N2 | Devops",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_geferson.PNG',
        },
    },

    {
        id: "bruno",
        type: "employee",
        position: { x: 900, y: 420 },
        data: {
            name: "Bruno",
            role: "Analista Suporte N1",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_bruno.PNG',
        },
    },

    {
        id: "patricia",
        type: "employee",
        position: { x: 1110, y: 420 },
        data: {
            name: "Patricia",
            role: "Analista Licitações",
            image: null,
        },
    },
];

const edges: Edge[] = [
    {
        id: "1",
        source: "roberto",
        target: "marcelo",
        animated: true,
    },

    {
        id: "2",
        source: "marcelo",
        target: "roberto-dev",
    },
    {
        id: "3",
        source: "marcelo",
        target: "leandro",
    },
    {
        id: "4",
        source: "marcelo",
        target: "vitor",
    },
    {
        id: "5",
        source: "marcelo",
        target: "geferson",
    },
    {
        id: "6",
        source: "marcelo",
        target: "bruno",
    },
    {
        id: "7",
        source: "marcelo",
        target: "patricia",
    },
];

export default function OrganogramaPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    return (
        <>
            <HeaderPage
                title="Organograma"
                description="A estrutura organizacional da LUSATI é definida da seguinte forma"
                icon={Building2}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Organograma</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="w-full h-160">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        color={isDark ? "#3f3f46" : "#d4d4d8"}
                        gap={20}
                    />
                </ReactFlow>
            </div>
        </>
    );
}

