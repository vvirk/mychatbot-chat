import { describe, it, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { chatReducer, agentMessageQueued, connectionStatusChanged } from "../chatSlice";
import { chatMiddleware } from "../chatMiddleware";
import { fakeSocket } from "../../../services/fakeSocket";

vi.spyOn(fakeSocket, "sendMessage").mockImplementation(() => {});

function createStore() {
  return configureStore({
    reducer: { chat: chatReducer },
    middleware: (gdm) => gdm().concat(chatMiddleware),
  });
}

describe("chatMiddleware", () => {
  it("should resend pending messages when reconnecting", () => {
    const store = createStore();

    store.dispatch(agentMessageQueued({
      clientId: "c1",
      content: "Hello",
      createdAt: "2023-01-01",
    }));

    store.dispatch(agentMessageQueued({
      clientId: "c2",
      content: "World",
      createdAt: "2023-01-01",
    }));

    expect(fakeSocket.sendMessage).not.toHaveBeenCalled();

    store.dispatch(connectionStatusChanged("connected"));

    expect(fakeSocket.sendMessage).toHaveBeenCalledTimes(2);

    expect(fakeSocket.sendMessage).toHaveBeenCalledWith({
      clientId: "c1",
      content: "Hello",
    });

    expect(fakeSocket.sendMessage).toHaveBeenCalledWith({
      clientId: "c2",
      content: "World",
    });
  });
});