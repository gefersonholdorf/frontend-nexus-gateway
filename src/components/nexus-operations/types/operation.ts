export type OperationStatus = "RUNNING" | "SUCCESS" | "ERROR"

export type OperationType = "BACKUP" | "RESTORE"

export interface OperationEvent {
  id: string
  operationId: string
  event: string
  status: boolean
  startedAt: string
}

export interface Operation {
  id: string
  type: OperationType
  title: string
  description?: string
  status: OperationStatus
  progress: number 
  currentStep?: string
  startedAt: string
  finishedAt?: string
  events: OperationEvent[]
}

export interface OperationsContextData {
  connected: boolean
  operations: Operation[]
  runningOperations: Operation[]
  hasRunningOperations: boolean
}