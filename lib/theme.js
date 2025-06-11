import { state } from "./state.js";
import { saveToLocalStorage } from "./storage.js";
import { updateChartTheme } from "./chart.js";

export function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

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
      saveToLocalStorage();
    });
  }

  return setTheme;
}
