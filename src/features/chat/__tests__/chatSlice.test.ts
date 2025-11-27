import { describe, it, expect } from "vitest";
import { chatReducer, agentMessageQueued, messageAcked, messageErrored } from "../chatSlice";
import type { ChatState } from "../types";

function createInitialState(): ChatState {
  return {
    connectionStatus: "disconnected",
    messages: [],
    outgoingQueue: [],
  };
}

describe("chatSlice", () => {
  it("should enqueue outgoing message as pending", () => {
    const initial = createInitialState();

    const action = agentMessageQueued({
      clientId: "c1",
      content: "Hello",
      createdAt: "2023-01-01T00:00:00Z",
    });

    const next = chatReducer(initial, action);

    expect(next.messages.length).toBe(1);
    expect(next.messages[0]).toMatchObject({
      clientId: "c1",
      from: "agent",
      content: "Hello",
      status: "pending",
    });

    expect(next.outgoingQueue).toContain("c1");
  });

  it("should mark message as sent on ack and remove from queue", () => {
    const initial: ChatState = {
      connectionStatus: "connected",
      messages: [
        {
          clientId: "c1",
          from: "agent",
          content: "Hello",
          createdAt: "2023-01-01",
          status: "pending",
        },
      ],
      outgoingQueue: ["c1"],
    };

    const action = messageAcked({
      clientId: "c1",
      serverId: "s123",
    });

    const next = chatReducer(initial, action);

    expect(next.messages[0].status).toBe("sent");
    expect(next.messages[0].serverId).toBe("s123");
    expect(next.outgoingQueue).not.toContain("c1");
  });

    it("should mark message as failed on error", () => {
    const initial: ChatState = {
      connectionStatus: "connected",
      messages: [
        {
          clientId: "c1",
          from: "agent",
          content: "Hello",
          createdAt: "2023-01-01",
          status: "pending",
        },
      ],
      outgoingQueue: ["c1"],
    };

    const action = messageErrored({
      clientId: "c1",
      reason: "Random error",
    });

    const next = chatReducer(initial, action);

    expect(next.messages[0].status).toBe("failed");
    expect(next.messages[0].errorReason).toBe("Random error");
    expect(next.outgoingQueue).not.toContain("c1");
  });
});