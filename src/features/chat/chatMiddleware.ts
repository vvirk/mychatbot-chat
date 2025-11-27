import type { Middleware } from "@reduxjs/toolkit";
import { fakeSocket } from "../../services/fakeSocket";
import { agentMessageQueued, connectionStatusChanged } from "./chatSlice";
import type { ChatMessage } from "./types";

type ChatSliceState = {
  connectionStatus: string;
  messages: ChatMessage[];
  outgoingQueue: string[];
};

export const chatMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    const state = store.getState() as { chat: ChatSliceState };

    if (agentMessageQueued.match(action)) {
      if (state.chat.connectionStatus === "connected") {
        const { clientId, content } = (action as {
          payload: { clientId: string; content: string };
        }).payload;

        fakeSocket.sendMessage({ clientId, content });
      }
    }

    if (connectionStatusChanged.match(action)) {
      if (state.chat.connectionStatus === "connected") {
        for (const clientId of state.chat.outgoingQueue) {
          const message = state.chat.messages.find(
            (m) => m.clientId === clientId
          );
          if (!message) continue;

          fakeSocket.sendMessage({ clientId, content: message.content });
        }
      }
    }

    return result;
  };