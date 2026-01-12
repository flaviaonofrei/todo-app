const PRIORITIES = [
  { key: "critical", label: "Critical", cls: "border-red-500/40 text-red-300" },
  { key: "high", label: "High", cls: "border-orange-500/40 text-orange-300" },
  { key: "medium", label: "Medium", cls: "border-yellow-500/40 text-yellow-300" },
  { key: "low", label: "Low", cls: "border-emerald-500/40 text-emerald-300" },
];

export default function TaskForm({
  title,
  setTitle,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  loading,
}) {
  return (
    <div className="mt-7 rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
      {/* Rând 1: input + buton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="w-full flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          maxLength={100}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button
          className="w-full sm:w-auto rounded-xl bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
          onClick={addTask}
          disabled={loading}
        >
          {loading ? "..." : "Add task"}
        </button>
      </div>

      {/* Rând 2: priority + due date */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPriority(p.key)}
              className={`rounded-full border px-3 py-2 text-xs transition ${
                priority === p.key
                  ? `${p.cls} bg-white/10`
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
              title={`Priority: ${p.label}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-xs text-zinc-500">Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}
