import type { ConnectionStatus } from "../types";

interface ChatHeaderProps {
  status: ConnectionStatus;
  onToggleConnection: () => void;
}

export function ChatHeader({ status, onToggleConnection }: ChatHeaderProps) {
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
      <h1 className="font-semibold text-sm">MyChatBot Agent Chat</h1>

      <div className="flex items-center gap-3 text-xs">
        <span>
          Status:{" "}
          <span
            className={
              isConnected
                ? "text-emerald-400"
                : isConnecting
                ? "text-yellow-300"
                : "text-slate-300"
            }
          >
            {status}
          </span>
        </span>

        <button
          type="button"
          onClick={onToggleConnection}
          className={`px-3 py-1 rounded text-xs ${
            isConnected
              ? "bg-slate-700 hover:bg-slate-600"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </header>
  );
}