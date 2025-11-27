import { createSlice } from "@reduxjs/toolkit";
import type { ChatState } from "./types";

const initialState: ChatState = {
  connectionStatus: "disconnected",
  messages: [],
  outgoingQueue: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
  },
});

export const chatReducer = chatSlice.reducer;