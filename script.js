//----------------------------------------//
// 📌 메인 (전체 초기화)
//----------------------------------------//

import { getStorage } from "./lib/storage.js";
import { state } from "./lib/state.js";
import { initChart } from "./lib/chart.js";
import { renderItem } from "./lib/render.js";
import { initTheme } from "./lib/theme.js";
import { bindEvents } from "./lib/event.js";

/**
 * 초기 실행
 */
document.addEventListener("DOMContentLoaded", () => {
    getStorage();
    const setTheme = initTheme();
    initChart();
    setTheme(state.appData.theme || "light");
    init();
    bindEvents();
    getToday();
});

/**
 * 초기 데이터 렌더링
 */
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

/**
 * 오늘 날짜 출력
 */
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
