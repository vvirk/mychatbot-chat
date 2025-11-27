interface OutgoingQueuePanelProps {
  outgoingQueue: string[];
}

export function OutgoingQueuePanel({ outgoingQueue }: OutgoingQueuePanelProps) {
  return (
    <aside className="w-64 flex flex-col border border-slate-700 rounded-lg text-xs overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-700 font-semibold bg-slate-800">
        Outgoing queue
      </div>
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
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
  );
}