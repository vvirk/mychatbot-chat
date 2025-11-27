import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectConnectionStatus,
  selectMessages,
  selectOutgoingQueue,
} from "../chatSelectors";
import { fakeSocket } from "../../../services/fakeSocket";
import { useChatConnection } from "../hooks/useChatConnection";
import { useChatServerEvents } from "../hooks/useChatServerEvents";
import { agentMessageQueued } from "../chatSlice";
import { ChatHeader } from "./ChatHeader";
import { MessagesPanel } from "./MessagesPanel";
import { OutgoingQueuePanel } from "./OutgoingQueuePanel";
import { ChatInput } from "./ChatInput";

export function ChatPage() {
  useChatConnection();
  useChatServerEvents();

  const dispatch = useAppDispatch();
  const connectionStatus = useAppSelector(selectConnectionStatus);
  const messages = useAppSelector(selectMessages);
  const outgoingQueue = useAppSelector(selectOutgoingQueue);

  const [draft, setDraft] = useState("");

  const handleToggleConnection = () => {
    if (connectionStatus === "connected") {
      fakeSocket.disconnect();
    } else {
      fakeSocket.connect();
    }
  };

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const createdAt = new Date().toISOString();

    dispatch(agentMessageQueued({ clientId, content: trimmed, createdAt }));
    setDraft("");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      <ChatHeader
        status={connectionStatus}
        onToggleConnection={handleToggleConnection}
      />

      <main className="flex flex-1 gap-4 p-4 overflow-hidden">
        <MessagesPanel messages={messages} />
        <OutgoingQueuePanel outgoingQueue={outgoingQueue} />
      </main>

      <ChatInput value={draft} onChange={setDraft} onSubmit={handleSend} />
    </div>
  );
}