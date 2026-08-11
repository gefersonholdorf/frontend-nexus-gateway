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
import {
    BaseEdge,
    getBezierPath,
    type EdgeProps,
    Position
} from "@xyflow/react";

function CommitteeEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
}: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition: Position.Bottom,
        targetX,
        targetY,
        targetPosition: Position.Top,
        curvature: 0.25,
    });

    return (
        <BaseEdge
            path={edgePath}
            style={{
                stroke: "#a855f7",
                strokeWidth: 2,
            }}
        />
    );
}

const edgeTypes = {
    committee: CommitteeEdge,
};

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
            isComite: false
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
            isComite: true
        },
    },

    {
        id: "roberto-dev",
        type: "employee",
        position: { x: 0, y: 420 },
        data: {
            name: "Roberto Amorim",
            role: "Analista Fullstack Senior",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_roberto.PNG',
            isComite: false
        },
    },

    {
        id: "vitor",
        type: "employee",
        position: { x: 300, y: 420 },
        data: {
            name: "Vitor",
            role: "Desenvolvedor Pleno II",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_vitor.PNG',
            isComite: false
        },
    },

    {
        id: "leandro",
        type: "employee",
        position: { x: 600, y: 420 },
        data: {
            name: "Leandro",
            role: "Desenvolvedor Pleno III",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_leandro.PNG',
            isComite: true
        },
    },

    {
        id: "geferson",
        type: "employee",
        position: { x: 900, y: 420 },
        data: {
            name: "Geferson",
            role: "Analista Suporte N2 | Devops",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_geferson.PNG',
            isComite: true
        },
    },

    {
        id: "bruno",
        type: "employee",
        position: { x: 1200 , y: 420 },
        data: {
            name: "Bruno",
            role: "Analista Suporte N1",
            image: 'https://api2.lusati.com.br/repositorio/nexus/avatar_bruno.PNG',
            isComite: false
        },
    }
];

const edges: Edge[] = [
    {
        id: "1",
        source: "roberto",
        target: "marcelo",
    },

    {
        id: "2",
        source: "marcelo",
        target: "roberto-dev",
    },
    {
        id: "4",
        source: "marcelo",
        target: "vitor",
    },
    {
        id: "6",
        source: "marcelo",
        target: "bruno",
    },
    {
        id: "sgci-leandro",
        source: "marcelo",
        target: "leandro",
    },

    {
        id: "sgci-geferson",
        source: "marcelo",
        target: "geferson",
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
            <div className="w-full h-180 border border-border">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
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

