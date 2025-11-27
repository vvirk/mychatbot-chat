import { useAppSelector } from "../../../app/hooks";
import {
  selectConnectionStatus,
  selectMessages,
  selectOutgoingQueue,
} from "../chatSelectors";
import { useChatConnection } from "../hooks/useChatConnection";
import { fakeSocket } from "../../../services/fakeSocket";

export function ChatPage() {
  useChatConnection();
  const connectionStatus = useAppSelector(selectConnectionStatus);
  const messages = useAppSelector(selectMessages);
  const outgoingQueue = useAppSelector(selectOutgoingQueue);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">

      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
        <div className="font-semibold">MyChatBot Agent Chat</div>
        <div className="flex items-center gap-3 text-sm">
            <span>Status: {connectionStatus}</span>
            <button
            type="button"
            className="px-3 py-1 rounded bg-slate-700 text-xs disabled:opacity-50"
            onClick={() => {
                if (connectionStatus === "connected" || connectionStatus === "connecting") {
                fakeSocket.disconnect();
                } else {
                fakeSocket.connect();
                }
            }}
            disabled={connectionStatus === "connecting"}
            >
            {connectionStatus === "connected" || connectionStatus === "connecting"
                ? "Disconnect"
                : "Connect"}
            </button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 gap-4 p-4">
        {/* Messages list */}
        <section className="flex-1 flex flex-col border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700 text-sm font-semibold bg-slate-800">
            Messages
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {messages.length === 0 ? (
              <div className="text-slate-400">No messages yet</div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.clientId ?? m.serverId}
                  className={`max-w-xs rounded px-3 py-2 ${
                    m.from === "agent"
                      ? "ml-auto bg-blue-600"
                      : "mr-auto bg-slate-700"
                  }`}
                >
                  <div className="text-xs text-slate-200 mb-1">
                    {m.from === "agent" ? "Agent" : "User"}
                  </div>
                  <div>{m.content}</div>
                  <div className="mt-1 text-[10px] text-slate-300">
                    status: {m.status}
                    {m.status === "failed" && m.errorReason
                      ? ` • ${m.errorReason}`
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Outgoing queue debug */}
        <aside className="w-64 border border-slate-700 rounded-lg text-xs">
          <div className="px-3 py-2 border-b border-slate-700 font-semibold bg-slate-800">
            Outgoing queue
          </div>
          <div className="p-3 space-y-1">
            {outgoingQueue.length === 0 ? (
              <div className="text-slate-400">Empty</div>
            ) : (
              outgoingQueue.map((id) => (
                <div
                  key={id}
                  className="rounded bg-slate-800 px-2 py-1 font-mono break-all"
                >
                  {id}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Input area */}
      <footer className="border-t border-slate-700 px-4 py-3">
        <form className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Type a message..."
            disabled
          />
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-600 text-sm font-semibold disabled:opacity-50"
            disabled
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}