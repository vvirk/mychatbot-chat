import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ChatState,
  ConnectionStatus,
  OutgoingAgentMessagePayload,
  AckPayload,
  ErrorPayload,
  IncomingMessagePayload,
} from "./types";

const initialState: ChatState = {
  connectionStatus: "disconnected",
  messages: [],
  outgoingQueue: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    connectionStatusChanged(state, action: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = action.payload;
    },
  agentMessageQueued(
    state,
    action: PayloadAction<OutgoingAgentMessagePayload>
  ) {
    const { clientId, content, createdAt } = action.payload;

    state.messages.push({
      clientId,
      from: "agent",
      content,
      createdAt,
      status: "pending",
    });

    state.outgoingQueue.push(clientId);
  },

  messageAcked(state, action: PayloadAction<AckPayload>) {
    const { clientId, serverId } = action.payload;

    const message = state.messages.find((m) => m.clientId === clientId);
    if (message) {
      message.status = "sent";
      message.serverId = serverId;
    }

    // прибираємо clientId з outgoingQueue, навіть якщо message не знайшли
    state.outgoingQueue = state.outgoingQueue.filter((id) => id !== clientId);
  },

  messageErrored(state, action: PayloadAction<ErrorPayload>) {
    const { clientId, reason } = action.payload;

    const message = state.messages.find((m) => m.clientId === clientId);
    if (message) {
      message.status = "failed";
      message.errorReason = reason;
    }

    state.outgoingQueue = state.outgoingQueue.filter((id) => id !== clientId);
  },

  incomingMessageReceived(
    state,
    action: PayloadAction<IncomingMessagePayload>
  ) {
    const { serverId, content, createdAt } = action.payload;

    state.messages.push({
      serverId,
      from: "user",
      content,
      createdAt,
      status: "sent",
    });
  },
  },
});

export const {
  connectionStatusChanged,
  agentMessageQueued,
  messageAcked,
  messageErrored,
  incomingMessageReceived,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;