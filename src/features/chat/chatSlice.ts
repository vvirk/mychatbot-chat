import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ChatState,
  ConnectionStatus,
  OutgoingAgentMessagePayload,
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
  },
});

export const { connectionStatusChanged, agentMessageQueued } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;