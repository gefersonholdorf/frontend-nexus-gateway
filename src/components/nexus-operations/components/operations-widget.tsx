import { Activity, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useOperations } from "../contexts/operations-context"
import { OperationCard } from "./operation-card"

export function OperationsWidget() {
  const [widgetOpen, setWidgetOpen] = useState(true)
  const { runningOperations, hasRunningOperations } = useOperations()

  function handleToggleWidget() {
    setWidgetOpen(prev => !prev)
  }

  if (!hasRunningOperations) {
    return (
      <div className="fixed bottom-6 right-4 z-50">
        <div
          className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600"
          onClick={handleToggleWidget}
        >
          <CheckCircle className="size-5 text-white" />
        </div>
      </div>
    )
  }

  return (
  <div className="fixed bottom-6 right-6 z-50">
  {/* Botão sempre fixo */}
  <button
    onClick={handleToggleWidget}
    className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg"
  >
    <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
    <Activity className="relative size-5 text-white" />
  </button>

  {/* Card abre acima do botão */}
  {widgetOpen && (
    <div className="absolute bottom-2 right-0 mb-2 w-96">
      <div className="h-80 overflow-y-auto rounded-xl bg-(image:--background-gradient) border border-border shadow-xl">
        <div className="p-3">
          {runningOperations.map((op) => (
            <OperationCard key={op.id} op={op} />
          ))}
        </div>
      </div>
    </div>
  )}
</div>
)
}