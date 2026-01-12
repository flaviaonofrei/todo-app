import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API = "http://localhost:5050";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

const FILTER_CLASS = {
  all: "border-zinc-700 text-zinc-200",
  critical: "border-red-500/40 text-red-300",
  high: "border-orange-500/40 text-orange-300",
  medium: "border-yellow-500/40 text-yellow-300",
  low: "border-emerald-500/40 text-emerald-300",
};

export default function App() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(""); // yyyy-mm-dd din input

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
  let list = filterPriority === "all"
    ? [...tasks]
    : tasks.filter((t) => (t.priority || "medium") === filterPriority);
  return list;
}, [tasks, filterPriority]);


  const addTask = async () => {
    try {
      setErr("");
      const trimmed = title.trim();
      if (!trimmed) return setErr("Introdu un titlu.");

      setLoading(true);

      const dueDateISO = dueDate ? new Date(dueDate).toISOString() : null;

      const res = await axios.post(`${API}/tasks`, {
        title: trimmed,
        priority,
        dueDate: dueDateISO,
        createdAt: new Date().toISOString(),
      });

      setTasks((prev) => [res.data, ...prev]);
      setTitle("");
      setPriority("medium");
      setDueDate("");
    } catch (e) {
      setErr(e?.response?.data?.error || "Eroare la crearea task-ului.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (task) => {
    setErr("");
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEdit = async (id) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) return setErr("Titlul nu poate fi gol.");

    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, title: trimmed } : x))
    );

    await axios.patch(`${API}/tasks/${id}/title`, { title: trimmed });
    cancelEdit();
  };

  const toggleCompleted = async (id, completed) => {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, completed } : x))
    );
    await axios.patch(`${API}/tasks/${id}`, { completed });
  };
  const updateDueDate = async (id, dueDateISO) => {
  setTasks((prev) =>
    prev.map((t) => (t.id === id ? { ...t, dueDate: dueDateISO } : t))
  );

  try {
    await axios.patch(`${API}/tasks/${id}/dueDate`, {
      dueDate: dueDateISO,
    });
  } catch (e) {
    setErr(e?.response?.data?.error || "Failed to update due date.");
  }
};

  const removeTask = async (task) => {
    if (!task.completed) {
      const ok = window.confirm("Are you sure you want to delete the task?");
      if (!ok) return;
    }
    setTasks((prev) => prev.filter((x) => x.id !== task.id));
    await axios.delete(`${API}/tasks/${task.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          </div>

          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            {filteredTasks.length} / {tasks.length} tasks
          </span>
        </div>

        <TaskForm
          title={title}
          setTitle={setTitle}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          addTask={addTask}
          loading={loading}
        />

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Your agenda</h2>
          {/* ✅ trimitem filteredTasks */}
          <TaskList
            tasks={filteredTasks}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            editingId={editingId}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            toggleCompleted={toggleCompleted}
            removeTask={removeTask}
            updateDueDate={updateDueDate}
          />

          <p className="mt-4 text-xs text-zinc-500">
            Tips: Enter = add/save, Esc = cancel edit.
          </p>
        </div>
      </div>
    </div>
  );
}
