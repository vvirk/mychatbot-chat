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
  private randomDisconnectIntervalId: number | null = null;

  private isAutoReconnectScheduled = false;

  getStatus(): ConnectionStatus {
    return this.status;
  }

  connect(): void {
    if (this.status === "connected" || this.status === "connecting") return;

    this.setStatus("connecting");

    setTimeout(() => {
      this.setStatus("connected");

      this.startIncomingInterval();
      this.startRandomDisconnectInterval();
    }, 500);
  }

  disconnect(): void {
    if (this.status === "disconnected") return;

    this.setStatus("disconnected");

    this.stopIncomingInterval();
    this.stopRandomDisconnectInterval();

    if (!this.isAutoReconnectScheduled) return;

    this.isAutoReconnectScheduled = false;

    setTimeout(() => {
      this.connect();
    }, 1200 + Math.random() * 1500);
  }

  sendMessage(payload: { clientId: string; content: string }): void {
    const { clientId } = payload;

    if (this.status !== "connected") return;

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

  private startIncomingInterval() {
    if (this.incomingIntervalId != null) return;

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

  private stopIncomingInterval() {
    if (this.incomingIntervalId != null) {
      clearInterval(this.incomingIntervalId);
      this.incomingIntervalId = null;
    }
  }

  private startRandomDisconnectInterval() {
    if (this.randomDisconnectIntervalId != null) return;

    this.randomDisconnectIntervalId = window.setInterval(() => {
      if (this.status !== "connected") return;

      const shouldDisconnect = Math.random() < 0.15;
      if (!shouldDisconnect) return;

      this.isAutoReconnectScheduled = true;
      this.disconnect();
    }, 6000);
  }

  private stopRandomDisconnectInterval() {
    if (this.randomDisconnectIntervalId != null) {
      clearInterval(this.randomDisconnectIntervalId);
      this.randomDisconnectIntervalId = null;
    }
  }
}

export const fakeSocket: FakeSocket = new FakeSocketImpl();