import type { RootState } from "../../app/store";

export const selectConnectionStatus = (state: RootState) =>
  state.chat.connectionStatus;

export const selectMessages = (state: RootState) => state.chat.messages;

export const selectOutgoingQueue = (state: RootState) =>
  state.chat.outgoingQueue;