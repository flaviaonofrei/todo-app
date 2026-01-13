// ===============================
// 1. IMPORTURI & CONFIGURARE DE BAZĂ
// ===============================

const express = require("express");        // Framework pentru server HTTP
const cors = require("cors");              // Permite accesul frontend-ului (CORS)
require("dotenv").config();                // Încarcă variabilele din .env

const admin = require("firebase-admin");   // SDK pentru Firebase Admin

// Luăm cheia Firebase din variabila de mediu (Render / Railway / etc)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express();                     // Inițializăm serverul Express


// ===============================
// 2. CONFIGURARE CORS (securitate)
// ===============================

// Domeniile care au voie să apeleze acest backend
const allowedOrigins = [
  "http://localhost:5173",                       // Frontend local
  "https://superlative-melba-729982.netlify.app" // Frontend din producție (Netlify)
];

// Middleware CORS: blochează orice request din alte domenii
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Permite serverului să citească JSON din request body
app.use(express.json());


// ===============================
// 3. HEALTH CHECK (monitorizare)
// ===============================

// Endpoint folosit de Render ca să verifice dacă serverul este pornit
app.get("/health", (req, res) => res.status(200).send("ok"));


// conectare firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

// referinta catre baza de date firestore
const db = admin.firestore();

app.use(cors());
app.use(express.json());

// -------------------- CONSTANTE / HELPERS --------------------
// prioritatile taskurile (gradul de importanta)
const ALLOWED_PRIORITIES = ["critical", "high", "medium", "low"];
const MAX_TITLE_LEN = 100; // maxim 100 de caractere pt titlu


// validare titlu pt un task
function validateTitle(title) {
  if (!title || title.trim() === "") {
    return { ok: false, error: "Title is required" };
  }
  const trimmed = title.trim();
  if (trimmed.length > MAX_TITLE_LEN) {
    return { ok: false, error: `Title too long (max ${MAX_TITLE_LEN})` };
  }
  return { ok: true, value: trimmed };
}
// validare prioritate
function validatePriority(priority) {
  const p = (priority || "medium").toLowerCase();
  if (!ALLOWED_PRIORITIES.includes(p)) {
    return { ok: false, error: "Invalid priority" };
  }
  return { ok: true, value: p };
}

// -------------------- ROUTES --------------------

// root-ul
app.get("/", (req, res) => {
  res.send("api todo app is running");
});

// GET - lista task-uri - returneaza toate task-urile existente in bd
app.get("/tasks", async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").orderBy("createdAt", "desc").get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST - creeaza un task nou
app.post("/tasks", async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    const t = validateTitle(title);
    if (!t.ok) return res.status(400).json({ error: t.error });

    const p = validatePriority(priority);
    if (!p.ok) return res.status(400).json({ error: p.error });
    
    let due = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid dueDate" });
      }
      due = d.toISOString();
    }

    const newTask = {
      title: t.value,
      priority: p.value, // default = medium
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date(),
    };

    const docRef = await db.collection("tasks").add(newTask);

    res.status(201).json({
      id: docRef.id,
      ...newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH - update task completed - marcheaza ca si finalizat task ul
app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed must be boolean" });
    }

    await db.collection("tasks").doc(id).update({ completed });

    res.json({ id, completed });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// PATCH - update task title - schimba titlul (edit)
app.patch("/tasks/:id/title", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const t = validateTitle(title);
    if (!t.ok) return res.status(400).json({ error: t.error });

    await db.collection("tasks").doc(id).update({
      title: t.value,
    });

    res.json({ id, title: t.value });
  } catch (error) {
    console.error("Error updating title:", error);
    res.status(500).json({ error: "Failed to update title" });
  }
});

// PATCH - update prioritate task (schimba prioritatea taskului)
app.patch("/tasks/:id/priority", async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const p = (priority || "").toLowerCase();
    if (!ALLOWED_PRIORITIES.includes(p)) {
      return res.status(400).json({ error: "Invalid priority" });
    }

    await db.collection("tasks").doc(id).update({ priority: p });
    res.json({ id, priority: p });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ error: "Failed to update priority" });
  }
});

// DELETE - sterge task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("tasks").doc(id).delete();

    res.json({ id });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});
// schimba deadline ul task-ului
app.patch("/tasks/:id/dueDate", async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate } = req.body;

    if (dueDate) {
      const d = new Date(dueDate);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid dueDate" });
      }
    }

    await db.collection("tasks").doc(id).update({
      dueDate: dueDate || null,
    });

    res.json({ id, dueDate: dueDate || null });
  } catch (error) {
    console.error("Error updating dueDate:", error);
    res.status(500).json({ error: "Failed to update dueDate" });
  }
});

// --- pornire server - 0.0.0.0 necesar pentru Render (app ul de deploy al aplicatiei backend)
const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log("the server is running on port", PORT);
});

