import { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const PRIORITY_LABEL = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_CLASS = {
  critical: "bg-red-500/15 text-red-300 border-red-500/30",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function isoToInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function inputValueToISO(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function TaskItem({
  task,
  editingId,
  editingTitle,
  setEditingTitle,
  startEdit,
  cancelEdit,
  saveEdit,
  toggleCompleted,
  removeTask,
  updateDueDate,
}) {
  const isEditingTitle = editingId === task.id;
  const priorityKey = (task.priority || "medium").toLowerCase();

  const [isEditingDue, setIsEditingDue] = useState(false);
  const [dueInput, setDueInput] = useState(isoToInputValue(task.dueDate));

  const hasDue = !!task.dueDate;

  const openDueEditor = () => {
    setDueInput(isoToInputValue(task.dueDate));
    setIsEditingDue(true);
  };

  const cancelDueEditor = () => {
    setDueInput(isoToInputValue(task.dueDate));
    setIsEditingDue(false);
  };

  const saveDueEditor = async () => {
    const iso = inputValueToISO(dueInput);
    await updateDueDate(task.id, iso);
    setIsEditingDue(false);
  };

  const clearDueDate = async () => {
    await updateDueDate(task.id, null);
    setDueInput("");
    setIsEditingDue(false);
  };

  return (
    <li className={`flex items-center gap-3 px-4 py-3 ${task.completed ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => toggleCompleted(task.id, e.target.checked)}
        className="h-4 w-4 accent-white"
      />

      {isEditingTitle ? (
        <input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          autoFocus
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit(task.id);
            if (e.key === "Escape") cancelEdit();
          }}
        />
      ) : (
        <div className="flex-1">
          <p className={`font-semibold ${task.completed ? "line-through text-zinc-300" : ""}`}>
            {task.title}
          </p>

          {/* AICI e schimbarea: flex-col, Due date sub status */}
          <div className="mt-1 flex flex-col gap-1">
            {/* status */}
            <span className="text-xs text-zinc-500">
              {task.completed ? "completed" : "pending"}
            </span>

            {/* due date SUB status */}
            {!isEditingDue ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {hasDue ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                </span>

                <button
                  type="button"
                  onClick={openDueEditor}
                  disabled={task.completed}
                  className="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-300 hover:border-zinc-600 disabled:opacity-50"
                  title={task.completed ? "You can't edit completed tasks" : "Change due date"}
                >
                  <FaPencilAlt />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={dueInput}
                  onChange={(e) => setDueInput(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 outline-none focus:border-zinc-600"
                />

                <button
                  type="button"
                  onClick={saveDueEditor}
                  className="rounded-full border border-zinc-700 bg-white/10 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={cancelDueEditor}
                  className="rounded-full border border-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={clearDueDate}
                  className="rounded-full border border-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-600"
                  title="Remove due date"
                >
                  Clear
                </button>
              </div>
            )}

            {/* priority pe rând separat (mai estetic) */}
            <span
              className={`mt-1 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs ${
                PRIORITY_CLASS[priorityKey] || PRIORITY_CLASS.medium
              }`}
              title={`Priority: ${PRIORITY_LABEL[priorityKey] || "Medium"}`}
            >
              {PRIORITY_LABEL[priorityKey] || "Medium"}
            </span>
          </div>
        </div>
      )}

      {isEditingTitle ? (
        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-600"
            onClick={() => saveEdit(task.id)}
            type="button"
          >
            Save
          </button>
          <button
            className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-600"
            onClick={cancelEdit}
            type="button"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-xl border border-zinc-800 p-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white disabled:opacity-50"
            onClick={() => startEdit(task)}
            disabled={task.completed}
            title={task.completed ? "You can't edit completed tasks" : "Edit"}
            type="button"
          >
            <FaPencilAlt />
          </button>

          <button
            className="rounded-xl border border-zinc-800 p-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
            onClick={() => removeTask(task)}
            title="Remove"
            type="button"
          >
            <FaTrashAlt />
          </button>
        </div>
      )}
    </li>
  );
}
