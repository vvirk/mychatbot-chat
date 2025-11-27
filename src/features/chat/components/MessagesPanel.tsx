import type { ChatMessage } from "../types";

interface MessagesPanelProps {
  messages: ChatMessage[];
}

export function MessagesPanel({ messages }: MessagesPanelProps) {
  return (
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
              <div className="text-[11px] font-semibold mb-1">
                {m.from === "agent" ? "Agent" : "User"}
              </div>
              <div>{m.content}</div>
              <div className="mt-1 text-[10px]">
                <span
                  className={
                    m.status === "failed"
                      ? "text-red-300"
                      : m.status === "pending"
                      ? "text-yellow-300"
                      : "text-slate-300"
                  }
                >
                  status: {m.status}
                  {m.status === "failed" && m.errorReason
                    ? ` • ${m.errorReason}`
                    : ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}