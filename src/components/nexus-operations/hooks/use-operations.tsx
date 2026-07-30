import { useState, useMemo } from "react"
import type { Operation, OperationsContextData } from "../types/operation"

export function useOperations(): OperationsContextData {
  const [operations] = useState<Operation[]>([])
  const [connected] = useState(false)

  const runningOperations = useMemo(() =>
    operations.filter(op => op.status === "RUNNING"),
    [operations]
  )

  return {
    connected,
    operations,
    runningOperations,
    hasRunningOperations: runningOperations.length > 0,
  }
}