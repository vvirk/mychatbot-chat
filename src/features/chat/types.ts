export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export type MessageStatus = "pending" | "sent" | "failed";

export interface ChatMessage {
  clientId?: string;
  serverId?: string;
  from: "agent" | "user";
  content: string;
  createdAt: string;
  status: MessageStatus;
  errorReason?: string;
}

export interface ChatState {
  connectionStatus: ConnectionStatus;
  messages: ChatMessage[];
  outgoingQueue: string[];
}

export interface OutgoingAgentMessagePayload {
  clientId: string;
  content: string;
  createdAt: string;
}

export interface AckPayload {
  clientId: string;
  serverId: string;
}

export interface ErrorPayload {
  clientId: string;
  reason: string;
}

export interface IncomingMessagePayload {
  serverId: string;
  content: string;
  createdAt: string;
}