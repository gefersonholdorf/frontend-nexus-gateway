// // contexts/operations-context.tsx
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type PropsWithChildren,
// } from "react"
// import type { Operation, OperationsContextData } from "../types/operation"
// import { OperationsWidget } from "../components/operations-widget"
// import { OperationsWebSocket } from "../services/operations-websocket"

// const OperationsContext = createContext<OperationsContextData | null>(null)

// export function OperationsProvider({ children }: PropsWithChildren) {
//   const [operations, setOperations] = useState<Operation[]>([])
//   const [connected, setConnected] = useState(false)
//   const wsRef = useRef<OperationsWebSocket | null>(null)

//   const runningOperations = useMemo(
//     () => operations.filter((op) => op.status === "RUNNING"),
//     [operations]
//   )

//   const hasRunningOperations = runningOperations.length > 0

//   useEffect(() => {
//     if (wsRef.current) return

//     const ws = new OperationsWebSocket({
//       onOpen() {
//         setConnected(true)
//         console.log("🟢 Operations conectado")
//       },
//       onClose() {
//         setConnected(false)
//         console.log("🔴 Operations desconectado")
//       },
//       onError(error) {
//         console.error("WS erro:", error)
//       },
//       onOperation(message) {
//         switch (message.event) {
//           case "operation.started":
//             setOperations((prev) => [...prev, message.operation])
//             break

//           case "operation.updated":
//             setOperations((prev) =>
//               prev.map((op) =>
//                 op.id === message.operation.id ? message.operation : op
//               )
//             )
//             break

//           case "operation.finished":
//             setOperations((prev) =>
//               prev.filter((op) => op.id !== message.operation.id)
//             )
//             break
//         }
//       },
//     })

//     ws.connect()
//     wsRef.current = ws

//     return () => {
//       ws.disconnect()
//       wsRef.current = null
//     }
//   }, [])

//   const value = useMemo(
//     () => ({
//       operations,
//       runningOperations,
//       hasRunningOperations,
//       connected,
//     }),
//     [operations, runningOperations, hasRunningOperations, connected]
//   )

//   return (
//     <OperationsContext.Provider value={value}>
//       {children}
//       <OperationsWidget />
//     </OperationsContext.Provider>
//   )
// }

// export function useOperations() {
//   const context = useContext(OperationsContext)

//   if (!context) {
//     throw new Error(
//       "useOperations deve ser usado dentro de um OperationsProvider"
//     )
//   }

//   return context
// }