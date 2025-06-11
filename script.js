import { loadFromLocalStorage } from "./lib/storage.js";
import { state } from "./lib/state.js";
import { initChart } from "./lib/chart.js";
import { renderItem } from "./lib/render.js";
import { initTheme } from "./lib/theme.js";
import { bindEvents } from "./lib/event.js";

document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    const setTheme = initTheme();
    initChart();
    setTheme(state.appData.theme || "light");
    init();
    bindEvents();
    getToday();
});

function init() {
    const todoList = document.querySelector(".todoList");
    const scheduleList = document.querySelector(".scheduleList");

    state.todoListArray.forEach(item => {
        renderItem({ 
            type: "todo", 
            target: todoList, 
            item, 
            isInit: true 
        });
  });

    state.scheduleArray.forEach(item => {
        renderItem({ 
            type: "schedule", 
            target: scheduleList, 
            item, 
            isInit: true 
        });
    });
}

function getToday() {
    const todayDate = document.querySelector(".todayDate");
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const day = days[today.getDay()];
    todayDate.textContent = `${year}. ${month}. ${date} ${day}`;
}
