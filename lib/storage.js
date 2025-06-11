import { state } from './state.js';

export function saveToLocalStorage() {
  const data = {
    theme: state.appData.theme,
    todos: state.todoListArray,
    schedules: state.scheduleArray,
    alertShow: state.appData.alertShow,
  };
  localStorage.setItem("appData", JSON.stringify(data));
}

export function loadFromLocalStorage() {
  const saved = localStorage.getItem("appData");
  if (saved) {
    const parsed = JSON.parse(saved);
    state.appData = { ...state.appData, ...parsed };
    state.todoListArray = parsed.todos || [];
    state.scheduleArray = parsed.schedules || [];
  }
}
