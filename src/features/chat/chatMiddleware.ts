import type { Middleware } from "@reduxjs/toolkit";
import { fakeSocket } from "../../services/fakeSocket";
import { agentMessageQueued } from "./chatSlice";

export const chatMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    if (agentMessageQueued.match(action)) {
      const state = store.getState() as { chat: { connectionStatus: string } };

      if (state.chat.connectionStatus === "connected") {
        const { clientId, content } = action.payload as {
          clientId: string;
          content: string;
        };

        fakeSocket.sendMessage({ clientId, content });
      }
    }

    return result;
  };