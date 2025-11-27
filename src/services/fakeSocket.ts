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