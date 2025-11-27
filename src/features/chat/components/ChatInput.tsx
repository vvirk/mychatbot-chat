interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  const canSend = value.trim().length > 0;

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <form
      className="border-t border-slate-800 px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit();
      }}
    >
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Type a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          disabled={!canSend}
          className="px-4 py-2 rounded bg-blue-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </form>
  );
}