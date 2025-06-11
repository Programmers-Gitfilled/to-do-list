import { state } from "./state.js";
import { renderItem } from "./render.js";
import { updateStats } from "./stats.js";

export function bindEvents() {
  const addTodoButton = document.querySelector(".addTodoButton");
  const addScheduleButton = document.querySelector(".addScheduleButton");
  const todoInput = document.querySelector(".todoInput");
  const scheduleInput = document.querySelector(".scheduleInput");
  const todoList = document.querySelector(".todoList");
  const scheduleList = document.querySelector(".scheduleList");

  addTodoButton.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (text) {
      const id = Date.now().toString();
      const item = { id, value: text, isCompleted: false };
      renderItem({ type: "todo", target: todoList, item });
      todoInput.value = "";
    }
  });

  addScheduleButton.addEventListener("click", () => {
    const text = scheduleInput.value.trim();
    if (text) {
      const id = Date.now().toString();
      const item = { id, value: text, isCompleted: false };
      renderItem({ type: "schedule", target: scheduleList, item });
      scheduleInput.value = "";
    }
  });

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodoButton.click();
  });

  todoList.addEventListener("click", (e) => handleRemove(e, "todo"));
  scheduleList.addEventListener("click", (e) => handleRemove(e, "schedule"));

  todoList.addEventListener("change", (e) => handleDone(e, "todo"));
  scheduleList.addEventListener("change", (e) => handleDone(e, "schedule"));
}

function handleRemove(e, type) {
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.closest(`.${type}Item`);
    const id = li.dataset.id;
    li.remove();

    if (type === "todo") {
      state.todoListArray = state.todoListArray.filter(item => item.id !== id);
      state.appData.todos = [...state.todoListArray];
    } else {
      state.scheduleArray = state.scheduleArray.filter(item => item.id !== id);
      state.appData.schedules = [...state.scheduleArray];
    }
    updateStats();
  }
}

function handleDone(e, type) {
  if (e.target.type === "checkbox") {
    const li = e.target.closest(`.${type}Item`);
    const id = li.dataset.id;
    const isCompleted = e.target.checked;

    if (type === "todo") {
      const item = state.todoListArray.find(i => i.id === id);
      if (item) item.isCompleted = isCompleted;
    } else {
      const item = state.scheduleArray.find(i => i.id === id);
      if (item) item.isCompleted = isCompleted;
    }
    updateStats();
  }
}
