import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatState, ConnectionStatus } from "./types";

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
  },
});

export const { connectionStatusChanged } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;