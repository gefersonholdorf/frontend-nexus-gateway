import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface GetReportsBackupsResponse {
  backups: BackupReport[];
  statistics: BackupReportStatistics;
  generatedBy: string;
}

export interface BackupReport {
  backupJob: BackupJob;
  executions: BackupExecution[];
}

export interface BackupJob {
  cd_id: number;
  cd_backup_automation: number;
  ds_system: string;
  ds_description: string | null;
  ds_path: string;
  nr_retention_days: number;
  nr_backups_days: number;
  st_enabled: number;
  dt_next_executation_at: Date | null;
  dt_created_at: Date;
  dt_updated_at: Date;
}

export interface BackupExecution {
  date: string;
  path: string;
  createdAt: number;
  updatedAt: number;
  files: BackupFile[];
}

export interface BackupFile {
  name: string;
  path: string;
  size: number;
  type: string;
  createdAt: number;
  updatedAt: number;
}

export interface BackupReportStatistics {
  totalJobs: number;
  totalBackups: number;
  totalSize: number;
}

export function useGetReportsBackups() {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "get-reports-backups",
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/backups`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar documentos")
            }

            const result: GetReportsBackupsResponse = await response.json()

            return result
        },
    })
}