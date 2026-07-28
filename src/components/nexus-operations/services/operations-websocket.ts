import type { Operation } from "../types/operation";

type EventType =
    | "operation.started"
    | "operation.updated"
    | "operation.finished";

interface OperationEvent {
    event: EventType;
    operation: Operation;
}

interface OperationsWebSocketOptions {
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (event: Event) => void;
    onOperation?: (event: OperationEvent) => void;
}

export class OperationsWebSocket {
    private socket?: WebSocket;
    private options: OperationsWebSocketOptions;

    constructor(options: OperationsWebSocketOptions) {
        this.options = options;
    }

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        this.socket = new WebSocket(import.meta.env.VITE_OPERATIONS_WS_URL);

        this.socket.onopen = () => {
            this.options.onOpen?.();
        };

        this.socket.onclose = () => {
            this.options.onClose?.();
        };

        this.socket.onerror = (event) => {
            this.options.onError?.(event);
        };

        this.socket.onmessage = (event) => {
            const message: OperationEvent = JSON.parse(event.data);

            this.options.onOperation?.(message);
        };
    }

    disconnect() {
        this.socket?.close();
    }

    send(data: unknown) {
        if (this.socket?.readyState !== WebSocket.OPEN) return;

        this.socket.send(JSON.stringify(data));
    }
}