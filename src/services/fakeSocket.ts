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

  getStatus(): ConnectionStatus {
    return this.status;
  }

  connect(): void {
    if (this.status === "connected" || this.status === "connecting") return;

    this.setStatus("connecting");

    this.setStatus("connected");
  }

  disconnect(): void {
    if (this.status === "disconnected") return;
    this.setStatus("disconnected");
  }

  sendMessage(_payload: { clientId: string; content: string }): void {
    console.log("FakeSocket: sendMessage", _payload);
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