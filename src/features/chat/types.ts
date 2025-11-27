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