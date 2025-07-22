import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getCategories,
} from "./api";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Accent and theme colors from project requirements
const ACCENT_COLOR = "#FF4081";
const PRIMARY_COLOR = "#1976D2";
const SECONDARY_COLOR = "#424242";

// PUBLIC_INTERFACE
function App() {
  // App state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [orderBy, setOrderBy] = useState("due_date");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme] = useState("light"); // Light theme only

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const allTasks = await getTasks({
        search,
        category: currentCategory,
        completed: showOnlyCompleted,
        orderBy,
      });
      setTasks(allTasks);
    } catch (err) {
      alert("Failed to load tasks.");
    }
    setLoading(false);
  }, [search, currentCategory, showOnlyCompleted, orderBy]);

  // Fetch categories for sidebar
  const fetchCategories = useCallback(async () => {
    try {
      const allCategories = await getCategories();
      setCategories(allCategories);
    } catch(err) {
      // ignore error
    }
  }, []);

  useEffect(() => {
    // Always use a light theme
    document.documentElement.setAttribute("data-theme", "light");
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // PUBLIC_INTERFACE
  async function handleAddOrEditTask(task) {
    setLoading(true);
    try {
      if (task.id) {
        await updateTask(task.id, {
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          category: task.category,
          completed: task.completed,
        });
      } else {
        await addTask({
          ...task,
          completed: task.completed || false,
        });
      }
      setShowForm(false);
      setEditingTask(null);
      await fetchTasks();
      await fetchCategories();
    } catch (err) {
      alert("Failed to save task: " + (err.message || err));
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleEditTask(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  // PUBLIC_INTERFACE
  async function handleDeleteTask(task) {
    if (
      window.confirm(`Are you sure you want to delete "${task.title}"?`)
    ) {
      setLoading(true);
      try {
        await deleteTask(task.id);
        await fetchTasks();
        await fetchCategories();
      } catch (err) {
        alert("Failed to delete task: " + (err.message || err));
      }
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleToggleComplete(task) {
    setLoading(true);
    try {
      await updateTask(task.id, { completed: !task.completed });
      await fetchTasks();
    } catch (err) {
      alert("Failed to update completion: " + (err.message || err));
    }
    setLoading(false);
  }

  // For empty state
  function handleShowFormNew() {
    setEditingTask(null);
    setShowForm(true);
  }

  // UI
  return (
    <div className="App" style={{ background: "#fff", minHeight: "100vh" }}>
      <Header />
      <div className="app-container">
        <Sidebar
          categories={categories}
          current={currentCategory}
          onChange={(cat) => {
            setCurrentCategory(cat);
            setShowForm(false);
          }}
        />
        <main className="main-area">
          <div className="task-header-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tasks"
              style={{ borderColor: ACCENT_COLOR }}
            />
            <select
              className="order-select"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              aria-label="Sort by"
            >
              <option value="due_date">Due date</option>
              <option value="title">A-Z</option>
              <option value="created_at">Newest</option>
            </select>
            <button
              onClick={handleShowFormNew}
              className="add-task-btn"
              style={{
                background: ACCENT_COLOR,
                color: "#fff",
                borderRadius: 4,
                border: "none",
                fontWeight: "bold",
              }}
            >
              ＋ Add Task
            </button>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={!!showOnlyCompleted}
                onChange={() =>
                  setShowOnlyCompleted((v) => (v ? null : true))
                }
              />
              Completed only
            </label>
          </div>
          {showForm && (
            <TaskForm
              task={editingTask}
              categories={categories}
              onSave={handleAddOrEditTask}
              onCancel={() => setShowForm(false)}
            />
          )}
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
