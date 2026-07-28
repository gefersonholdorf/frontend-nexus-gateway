import { Activity, CircleCheck, X } from "lucide-react"
import type { Operation } from "../types/operation"


export function OperationCard({ op }: { op: Operation }) {

  return (
    <div className="flex flex-col p-2 justify-start">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="p-3 flex items-center justify-center bg-primary rounded-full">
          <Activity className="size-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-primary-text font-semibold">Central de Operações</span>
          <span className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
            <CircleCheck className="size-3" />
            Conectado
          </span>
        </div>
        </div>
        <div className="cursor-pointer">
          <X className="size-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}