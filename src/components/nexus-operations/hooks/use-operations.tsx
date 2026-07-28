import { useState, useMemo } from "react"
import type { Operation, OperationsContextData } from "../types/operation"

export function useOperations(): OperationsContextData {
  const [operations, setOperations] = useState<Operation[]>([])
  const [connected, setConnected] = useState(false)

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