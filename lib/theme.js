//----------------------------------------//
// 📌 테마 전환 모듈
//----------------------------------------//

import { state } from "./state.js";
import { setStorage } from "./storage.js";
import { updateChartTheme } from "./chart.js";


/**
 * 테마 초기화 및 토글 바인딩
 * @returns {Function} setTheme 함수 반환
 */
export function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;


  /**
   * 테마 변경
   * @param {string} theme 'light' 또는 'dark'
   */
  function setTheme(theme) {
    state.appData.theme = theme;
    if (theme === "dark") {
      body.setAttribute("data-theme", "dark");
      if (themeToggle) themeToggle.textContent = "🌙";
    } else {
      body.removeAttribute("data-theme");
      if (themeToggle) themeToggle.textContent = "☀️";
    }
    updateChartTheme();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = state.appData.theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      setStorage();
    });
  }

  return setTheme;
}
