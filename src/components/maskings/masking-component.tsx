import { type DataMaskingResponse } from "@/api/maskings/get-data-masking";
import { useTheme } from "@/contexts/theme-context";
import {
    Background,
    Handle,
    Position,
    ReactFlow,
    type Edge,
    type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Clock, Database, PlayCircle, Shield, Table } from "lucide-react";
import { useMemo } from "react";

// ─── Bolinha de status ───────────────────────────────────────────────────────

function StatusDot({ status }: { status: "SUCCESS" | "ERROR" | "PARTIAL_ERROR" }) {
    const colors = {
        SUCCESS: "bg-emerald-500",
        ERROR: "bg-red-500",
        PARTIAL_ERROR: "bg-amber-500",
    };

    return (
        <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]} ring-2 ring-white dark:ring-zinc-900 shrink-0`}
        />
    );
}

// ─── Tipos dos nós customizados ───────────────────────────────────────────────

type ExecutionNodeData = {
    execution: DataMaskingResponse["execution"];
};

type DatabaseNodeData = {
    database: DataMaskingResponse["databases"][number];
};

type TableNodeData = {
    table: DataMaskingResponse["databases"][number]["tables"][number];
    dbName: string;
};

// ─── Cores das bordas das edges por status ────────────────────────────────────

const statusStroke = {
    SUCCESS: "#10b981",
    ERROR: "#ef4444",
    PARTIAL_ERROR: "#f59e0b",
};

// ─── Nó: Execução (Raiz) ────────────────────────────────────────────────────

function ExecutionNode({ data }: { data: ExecutionNodeData }) {
    const { execution } = data;
    const duration = useMemo(() => {
        if (!execution.startedAt || !execution.finishedAt) return "-";
        const start = new Date(execution.startedAt);
        const end = new Date(execution.finishedAt);
        const diff = Math.round((end.getTime() - start.getTime()) / 1000);
        return `${diff}s`;
    }, [execution.startedAt, execution.finishedAt]);

    return (
        <div className="min-w-90 rounded-xl border border-border dark:border-amber-800 bg-transparent p-4 shadow-sm">
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className="flex items-center gap-3">
                <div className="rounded-full border border-border p-2">
                    <PlayCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        Execution {execution.executionId}
                    </h3>
                    <p className="text-[.9rem] text-muted-foreground">
                        {execution.status} · {execution.databasesSuccess}/{execution.databasesExpected} databases OK
                    </p>
                </div>
                <StatusDot status={execution.status} />
            </div>

            <div className="mt-2 flex items-center gap-1 text-[.9rem] text-muted-foreground">
                <Clock className="size-4" />
                <span>{duration}</span>
                {execution.isOfficialExecution && (
                    <span className="ml-auto flex items-center gap-1 font-medium text-[10px] text-amber-600 dark:text-amber-400">
                        <Shield className="w-3 h-3" /> OFFICIAL
                    </span>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

// ─── Nó: Database ─────────────────────────────────────────────────────────────

function DatabaseNode({ data }: { data: DatabaseNodeData }) {
    const { database } = data;

    const typeColors = {
        TENANT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        MASTER: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    };

    return (
        <div className="min-w-70 rounded-lg border border-border bg-transparent p-4 shadow-sm">
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <h4 className="font-semibold text-[.8rem] text-zinc-800 dark:text-zinc-200 truncate">
                    {database.name}
                </h4>
                <span
                    className={`ml-auto text-[10px]  font-bold px-2 py-0.5 rounded-full ${typeColors[database.type]}`}
                >
                    {database.type}
                </span>
                <StatusDot status={database.status} />
            </div>

            <div className="mt-2 flex items-center gap-3 text-[.8rem] text-muted-foreground">
                <span className="text-[.8rem]">{database.summary.tablesSuccess}/{database.summary.tablesExpected} tabelas OK</span>
                <span className="text-[.8rem]">{database.summary.recordsProcessed.toLocaleString()} registros</span>
            </div>

            {database.error && (
                <div className="mt-2 text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded px-2 py-1 line-clamp-2 border border-red-100 dark:border-red-900">
                    {database.error.code}: {database.error.message}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

// ─── Nó: Tabela ───────────────────────────────────────────────────────────────

function TableNode({ data }: { data: TableNodeData }) {
    const { table } = data;

    return (
        <div className="min-w-70 rounded-md border border-border bg-transparent p-4 shadow-sm">
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className="flex items-center gap-2">
                <Table className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-200 shrink-0" />
                <h5
                    className={`font-semibold text-[.8rem] truncate ${table.status === "ERROR"
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-700 dark:text-zinc-300"
                        }`}
                >
                    {table.name}
                </h5>
                <StatusDot status={table.status} />
            </div>

            <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="text-[.8rem]">{table.recordsProcessed.toLocaleString()} registros</span>
                {table.dynamic && (
                    <span className="text-blue-500 dark:text-blue-400 font-medium">DYNAMIC</span>
                )}
            </div>

            {table.error && (
                <div className="mt-1.5 text-[9px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded px-1.5 py-1 line-clamp-2 border border-red-100 dark:border-red-900">
                    {table.error.code}: {table.error.message}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

const nodeTypes = {
    execution: ExecutionNode,
    database: DatabaseNode,
    table: TableNode,
};

// ─── Helper: Gera nós e edges com layout hierárquico VERTICAL ───────────────

function buildFlowData(response: DataMaskingResponse): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const DB_SPACING_X = 340;
    const TABLE_SPACING_Y = 90;
    const LEVEL_EXECUTION = 0;
    const LEVEL_DATABASE = 200;
    const LEVEL_TABLE_START = 380;

    nodes.push({
        id: "execution-root",
        type: "execution",
        position: { x: 0, y: LEVEL_EXECUTION },
        data: { execution: response.execution },
    });

    const databases = response.databases ?? [];
    const totalDbWidth = (databases.length - 1) * DB_SPACING_X;
    const dbStartX = -totalDbWidth / 2;

    databases.forEach((db, dbIndex) => {
        const dbX = dbStartX + dbIndex * DB_SPACING_X;

        nodes.push({
            id: `db-${db.name}`,
            type: "database",
            position: { x: dbX, y: LEVEL_DATABASE },
            data: { database: db },
        });

        edges.push({
            id: `e-root-${db.name}`,
            source: "execution-root",
            target: `db-${db.name}`,
            animated: db.status !== "SUCCESS",
            style: { stroke: statusStroke[db.status], strokeWidth: 1.5 },
        });

        const tables = db.tables ?? [];
        tables.forEach((table, tIndex) => {
            const tableY = LEVEL_TABLE_START + tIndex * TABLE_SPACING_Y;

            nodes.push({
                id: `table-${db.name}-${table.name}`,
                type: "table",
                position: { x: dbX, y: tableY },
                data: { table, dbName: db.name },
            });

            const sourceId = tIndex === 0 ? `db-${db.name}` : `table-${db.name}-${tables[tIndex - 1].name}`;
            edges.push({
                id: `e-${db.name}-${table.name}`,
                source: sourceId,
                target: `table-${db.name}-${table.name}`,
                animated: table.status !== "SUCCESS",
                style: { stroke: statusStroke[table.status], strokeWidth: 1.5 },
            });
        });
    });

    return { nodes, edges };
}

// ─── Componente Principal ───────────────────────────────────────────────────

export default function DataMaskingFlowPage({ data }: { data: DataMaskingResponse }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { nodes, edges } = useMemo(() => {
        if (!data) return { nodes: [], edges: [] };
        return buildFlowData(data);
    }, [data]);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
                Nenhum dado de execução encontrado.
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-[calc(100vh-140px)] min-h-150 rounded-xl bg-(image:--background-gradient) border border-border shadow-xl">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    defaultViewport={{
                        x: 450,
                        y: 80,
                        zoom: 0.80
                    }}
                    proOptions={{ hideAttribution: true }}
                    minZoom={0.6}
                    maxZoom={4.0}
                >
                    <Background
                        color={isDark ? "#000" : "#fff"}
                        gap={24}
                    />
                </ReactFlow>
            </div>
        </>
    );
}