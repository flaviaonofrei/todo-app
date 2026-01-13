import TaskItem from "./TaskItem";

// Definiția filtrelor de prioritate afișate în UI
const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

// Clase Tailwind asociate fiecărei priorități (stilizare butoane active)
const FILTER_CLASS = {
  all: "border-zinc-700 text-zinc-200",
  critical: "border-red-500/40 text-red-300",
  high: "border-orange-500/40 text-orange-300",
  medium: "border-yellow-500/40 text-yellow-300",
  low: "border-emerald-500/40 text-emerald-300",
};

export default function TaskList(props) {
  // Datele și filtrul activ sunt primite din App.jsx
  const { tasks, filterPriority, setFilterPriority } = props;

  return (
    <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-950">
      {/* Header: titlu + controlul de filtrare */}
      <div className="flex flex-col gap-3 border-b border-zinc-900 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Tasks</h3>
          <p className="text-xs text-zinc-500">Filter by priority</p>
        </div>

        {/* Butoane de filtrare după prioritate */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterPriority(f.key)}
              className={`rounded-full border px-3 py-2 text-xs transition ${
                filterPriority === f.key
                  ? `${FILTER_CLASS[f.key]} bg-white/10` // filtru activ
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600" // filtru inactiv
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mesaj dacă nu există task-uri pentru filtrul selectat */}
      {tasks.length === 0 ? (
        <div className="p-6 text-sm text-zinc-400">
          You don't have tasks for the selected filter.
        </div>
      ) : (
        // Listă scrollabilă de task-uri
        <ul className="divide-y divide-zinc-900 overflow-y-auto max-h-[420px]">
          {tasks.map((t) => (
            // Fiecare task este randat prin componenta TaskItem
            <TaskItem key={t.id} task={t} {...props} />
          ))}
        </ul>
      )}
    </div>
  );
}
