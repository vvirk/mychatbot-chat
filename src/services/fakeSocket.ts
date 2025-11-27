import type { ConnectionStatus } from "../features/chat/types";

export type ServerMessageEvent =
  | {
      type: "ack";
      clientId: string;
      serverId: string;
    }
  | {
      type: "error";
      clientId: string;
      reason: string;
    }
  | {
      type: "incoming";
      serverId: string;
      content: string;
      createdAt: string;
    };

export type ServerEventListener = (event: ServerMessageEvent) => void;
export type StatusListener = (status: ConnectionStatus) => void;

export interface FakeSocket {
  getStatus(): ConnectionStatus;

  connect(): void;
  disconnect(): void;

  sendMessage(payload: { clientId: string; content: string }): void;

  subscribeToServerEvents(listener: ServerEventListener): () => void;
  subscribeToStatusChanges(listener: StatusListener): () => void;
}

class FakeSocketImpl implements FakeSocket {
  private status: ConnectionStatus = "disconnected";

  private statusListeners = new Set<StatusListener>();
  private serverListeners = new Set<ServerEventListener>();

  private incomingIntervalId: number | null = null;

  getStatus(): ConnectionStatus {
    return this.status;
  }

  connect(): void {
    if (this.status === "connected" || this.status === "connecting") return;

    this.setStatus("connecting");

    setTimeout(() => {
      this.setStatus("connected");

      if (this.incomingIntervalId == null) {
        this.incomingIntervalId = window.setInterval(() => {
          if (this.status !== "connected") return;

          const serverId = `srv-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`;
          const createdAt = new Date().toISOString();

          this.emitServerEvent({
            type: "incoming",
            serverId,
            content: "Hello from user " + serverId.slice(-4),
            createdAt,
          });
        }, 8000);
      }
    }, 500);
  }

  disconnect(): void {
    if (this.status === "disconnected") return;

    this.setStatus("disconnected");

    if (this.incomingIntervalId != null) {
      clearInterval(this.incomingIntervalId);
      this.incomingIntervalId = null;
    }
  }

  sendMessage(payload: { clientId: string; content: string }): void {
    const { clientId } = payload;

    if (this.status !== "connected") {
      return;
    }

    const delay = 400 + Math.random() * 900;

    setTimeout(() => {
      if (this.status !== "connected") return;

      const shouldFail = Math.random() < 0.2;

      if (shouldFail) {
        this.emitServerEvent({
          type: "error",
          clientId,
          reason: "Random simulated error",
        });
      } else {
        const serverId = `srv-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`;

        this.emitServerEvent({
          type: "ack",
          clientId,
          serverId,
        });
      }
    }, delay);
  }

  subscribeToServerEvents(listener: ServerEventListener): () => void {
    this.serverListeners.add(listener);
    return () => {
      this.serverListeners.delete(listener);
    };
  }

  subscribeToStatusChanges(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private setStatus(next: ConnectionStatus) {
    if (this.status === next) return;
    this.status = next;
    this.statusListeners.forEach((listener) => listener(this.status));
  }

  private emitServerEvent(event: ServerMessageEvent) {
    this.serverListeners.forEach((listener) => listener(event));
  }
}

export const fakeSocket: FakeSocket = new FakeSocketImpl();