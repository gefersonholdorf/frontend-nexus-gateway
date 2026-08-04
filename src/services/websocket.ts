class WebSocketService {
  private socket: WebSocket | null = null;
  private manuallyClosed = false;

  private listeners = new Set<(data: any) => void>();

  connect() {
    if (
      this.socket &&
      (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      )
    ) {
      return;
    }

    this.manuallyClosed = false;

    this.socket = new WebSocket("ws://127.0.0.1:3336/ws");

    this.socket.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        this.listeners.forEach((listener) => {
          listener(message);
        });
      } catch (err) {
        console.error("Erro ao processar mensagem do WebSocket:", err);
      }
    };

    this.socket.onclose = () => {
      console.log("❌ WebSocket desconectado");

      this.socket = null;

      if (!this.manuallyClosed) {
        setTimeout(() => this.connect(), 5000);
      }
    };

    this.socket.onerror = (err) => {
      console.error(err);
    };
  }

  disconnect() {
    this.manuallyClosed = true;

    this.socket?.close();
    this.socket = null;
  }

  onMessage(listener: (data: any) => void) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const websocket = new WebSocketService();