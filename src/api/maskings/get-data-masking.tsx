import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface DataMaskingResponse {
  execution: Execution;
  databases: DatabaseExecution[];
}

export interface Execution {
  executionId: string;
  environment: string;
  executionMode: string;
  isOfficialExecution: boolean;
  dataLoad: DataLoad;
  startedAt: string;
  finishedAt: string;
  status: ExecutionStatus;
  userAccessControl: UserAccessControl;
  databasesExpected: number;
  databasesProcessed: number;
  databasesSuccess: number;
  databasesPartialError: number;
  databasesError: number;
}

export interface DataLoad {
  sourceEnvironment: string;
  targetEnvironment: string;
}

export interface UserAccessControl {
  prefix: string;
  usersFound: number;
  usersLocked: number;
  usersUnlocked: number;
  lockStatus: ExecutionStatus;
  unlockStatus: ExecutionStatus;
}

export interface DatabaseExecution {
  name: string;
  type: DatabaseType;
  startedAt: string;
  finishedAt: string;
  status: ExecutionStatus;
  summary: DatabaseSummary;
  tables: TableExecution[];
  error: ExecutionError | null;
}

export interface DatabaseSummary {
  tablesExpected: number;
  tablesProcessed: number;
  tablesSuccess: number;
  tablesError: number;
  recordsProcessed: number;
}

export interface TableExecution {
  name: string;
  status: ExecutionStatus;
  recordsProcessed: number;
  dynamic?: boolean;
  columnsNulled?: number;
  columnsNotChanged?: number;
  error: ExecutionError | null;
}

export interface ExecutionError {
  code: string;
  message: string;
}

export type ExecutionStatus =
  | "SUCCESS"
  | "ERROR"
  | "PARTIAL_ERROR";

export type DatabaseType =
  | "TENANT"
  | "MASTER";

export function useGetDataMasking({ executionId }: {executionId: string}) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "data-masking", executionId,
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/data-masking/${executionId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status === 401) {
                handleSetLoginExpired(true)
            }

            if (response.status !== 200) {
                throw new Error("Erro ao listar mascaramentos")
            }

            const result: DataMaskingResponse = await response.json()

            return result
        },
    })
}