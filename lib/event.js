//----------------------------------------//
// 📌 이벤트 바인딩 모듈
//----------------------------------------//

import { state } from "./state.js";
import { renderItem } from "./render.js";
import { updateStats } from "./stats.js";

/**
 * 모든 이벤트 핸들러 바인딩 (투두 추가, 삭제, 체크 등)
 */
export function bindEvents() {
  const addTodoButton = document.querySelector(".addTodoButton");
  const addScheduleButton = document.querySelector(".addScheduleButton");
  const todoInput = document.querySelector(".todoInput");
  const scheduleInput = document.querySelector(".scheduleInput");
  const todoList = document.querySelector(".todoList");
  const scheduleList = document.querySelector(".scheduleList");

  // Todo 추가
  addTodoButton.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (text) {
      const id = Date.now().toString();
      const item = { id, value: text, isCompleted: false };
      renderItem({ type: "todo", target: todoList, item });
      todoInput.value = "";
    }
  });

  // Schedule 추가
  addScheduleButton.addEventListener("click", () => {
    const text = scheduleInput.value.trim();
    if (text) {
      const id = Date.now().toString();
      const item = { id, value: text, isCompleted: false };
      renderItem({ type: "schedule", target: scheduleList, item });
      scheduleInput.value = "";
    }
  });

  // Enter 입력 처리
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodoButton.click();
  });

  // 삭제 이벤트 바인딩
  todoList.addEventListener("click", (e) => handleRemove(e, "todo"));
  scheduleList.addEventListener("click", (e) => handleRemove(e, "schedule"));

  // 체크박스 변경 바인딩
  todoList.addEventListener("change", (e) => handleDone(e, "todo"));
  scheduleList.addEventListener("change", (e) => handleDone(e, "schedule"));
}


/**
 * 삭제 핸들러
 * @param {Event} e 클릭 이벤트
 * @param {string} type 'todo' 또는 'schedule'
 */
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

/**
 * 할 일 목록 완료 여부(체크) 핸들러
 * @param {Event} e change 이벤트
 * @param {string} type 'todo' 또는 'schedule'
 */
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
