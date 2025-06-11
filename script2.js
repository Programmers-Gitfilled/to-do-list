// 파일 세분화 전 코드 (branch-se3)

let completionChart;
let todoListArray = [];
let scheduleArray = [];

let appData = {
  theme: "light",
  todos: [],
  schedules: [],
  alertShow: false,
};

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function updateChartTheme() {
  if (!completionChart) return;

  const currentTheme = body.getAttribute("data-theme");
  const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

  completionChart.data.datasets[0].backgroundColor[2] = backgroundColor;
  completionChart.update();
}

function setTheme(theme) {
  appData.theme = theme;

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
    const currentTheme = appData.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setStorage();
  });
}

function setStorage() {
  const data = {
    theme: appData.theme,
    todos: todoListArray,
    schedules: scheduleArray,
    alertShow : appData.alertShow,
  };
  localStorage.setItem("appData", JSON.stringify(data));
}

function getStorage() {
  const saved = localStorage.getItem("appData");
  if (saved) {
    const parsed = JSON.parse(saved);
    appData = { ...appData, ...parsed };
    todoListArray = parsed.todos || [];
    scheduleArray = parsed.schedules || [];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getStorage();
  setTheme(appData.theme || "light");

  initChart();
  init();
  getToday();

  const addTodoButton = document.querySelector(".addTodoButton");
  const addScheduleButton = document.querySelector(".addScheduleButton");
  const todoInput = document.querySelector(".todoInput");
  const todoList = document.querySelector(".todoList");
  const scheduleInput = document.querySelector(".scheduleInput");
  const scheduleList = document.querySelector(".scheduleList");

  if (addTodoButton && todoInput && todoList) {
    addTodoButton.addEventListener("click", function () {
      const todoText = todoInput.value.trim();
      if (todoText) {
        const id = Date.now().toString();
        renderItem({
          type: "todo",
          target: todoList,
          value: todoText,
          id: id,
        });
        todoInput.value = "";
      }
    });
  }

  if (addScheduleButton && scheduleInput && scheduleList) {
    addScheduleButton.addEventListener("click", function () {
      const scheduleText = scheduleInput.value.trim();
      if (scheduleText) {
        const id = Date.now().toString();
        renderItem({
          type: "schedule",
          target: scheduleList,
          value: scheduleText,
          id: id,
        });
        scheduleInput.value = "";
      }
    });
  }

  if (todoInput && addTodoButton) {
    todoInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTodoButton.click();
      }
    });
  }

  if (scheduleInput && addScheduleButton) {
    scheduleInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addScheduleButton.click();
      }
    });
  }

  if (todoList) {
    todoList.addEventListener("click", (e) => handleRemove(e, "todo"));
    todoList.addEventListener("change", (e) => {
      const [id, isCompleted] = handleChange(e, "todo");
      if (id) {
        const todoItem = todoListArray.find((item) => item.id === id);
        if (todoItem) {
          todoItem.isCompleted = isCompleted;
          appData.todos = [...todoListArray];
          updateStats();
        }
      }
    });
  }

  if (scheduleList) {
    scheduleList.addEventListener("click", (e) => handleRemove(e, "schedule"));
    scheduleList.addEventListener("change", (e) => {
      const [id, isCompleted] = handleChange(e, "schedule");
      if (id) {
        const scheduleItem = scheduleArray.find((item) => item.id === id);
        if (scheduleItem) {
          scheduleItem.isCompleted = isCompleted;
          appData.schedules = [...scheduleArray];
          updateStats();
        }
      }
    });
  }
});

function initChart() {
  const ctx = document.getElementById("completionChart");
  if (!ctx) {
    console.error("Canvas element not found");
    return;
  }

  const currentTheme = document.body.getAttribute("data-theme");
  const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

  completionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["todos", "schedules", "incomplete"],
      datasets: [
        {
          data: [0, 0, 100],
          backgroundColor: ["#2D67FF", "#f8dd63", backgroundColor],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "80%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function handleRemove(e, type) {
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.closest(`.${type}Item`);
    if (li) {
      const id = li.dataset.id;
      removeItem(id, type);
    }
  }
}

function handleChange(e, type) {
  if (e.target.type === "checkbox") {
    const li = e.target.closest(`.${type}Item`);
    if (li) {
      const id = li.dataset.id;
      const isCompleted = e.target.checked;
      return [id, isCompleted];
    }
  }
  return [null, null];
}

function getToday() {
  const todayDate = document.querySelector(".todayDate");
  if (todayDate) {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const day = days[today.getDay()];
    todayDate.textContent = `${year}. ${month}. ${date} ${day}`;
  }
}

function createItem(type, value, id, isCompleted = false) {
  return `
    <li class="${type}Item" data-id="${id}">
      <div class="checkboxWrapper">
        <input type="checkbox" id="${type}-${id}" ${
    isCompleted ? "checked" : ""
  } />
        <span class="${type}Text">${value}</span>
      </div>
      <button class="deleteBtn">❌</button>
    </li>
  `.trim();
}

function renderItem({
  type,
  target,
  value,
  id,
  isCompleted = false,
  isInit = false,
}) {
  if (!target) {
    console.error("Target element not found for:", type);
    return;
  }

  const liHTML = createItem(type, value, id, isCompleted);
  const temp = document.createElement("div");
  temp.innerHTML = liHTML;
  const li = temp.firstElementChild;
  target.appendChild(li);

  if (!isInit) {
    if (type === "todo") {
      todoListArray.push({ id, value, isCompleted });
      appData.todos = [...todoListArray];
    }
    if (type === "schedule") {
      scheduleArray.push({ id, value, isCompleted });
      appData.schedules = [...scheduleArray];
    }
    setStorage();
  }

  updateStats();
}

function updateStats() {
  const todoCnt = todoListArray.length;
  const todoDoneCnt = todoListArray.filter((item) => item.isCompleted).length;
  const scheduleCnt = scheduleArray.length;
  const scheduleDoneCnt = scheduleArray.filter(
    (item) => item.isCompleted
  ).length;

  const totalCnt = todoCnt + scheduleCnt;
  const totalDone = todoDoneCnt + scheduleDoneCnt;
  const totalRemain = totalCnt - totalDone;

  const totalRate =
    totalCnt === 0 ? 0 : Math.round((totalDone / totalCnt) * 100);

  if (totalRate === 100 && totalCnt > 0 && appData.alertShow !== true) {
    alert("🔥 할 일 완료 !");
    appData.alertShow = true;
  } else if (totalRate < 100) {
    appData.alertShow = false;
  }

  const totalCountEl = document.querySelector(".totalCount");
  const completedCountEl = document.querySelector(".completedCount");
  const rateEl = document.querySelector(".rate");

  if (totalCountEl) totalCountEl.textContent = totalCnt;
  if (completedCountEl) completedCountEl.textContent = totalDone;
  if (rateEl) rateEl.textContent = `${Math.round(totalRate)}%`;

  if (completionChart) {
    completionChart.data.datasets[0].data = [
      todoDoneCnt,
      scheduleDoneCnt,
      totalRemain,
    ];
    completionChart.update();
  }

  setStorage();
}

function removeItem(id, type) {
  const item = document.querySelector(`li[data-id="${id}"]`);

  if (item) {
    item.remove();
  }

  if (type === "todo") {
    todoListArray = todoListArray.filter((item) => item.id !== id);
    appData.todos = [...todoListArray];
  }

  if (type === "schedule") {
    scheduleArray = scheduleArray.filter((item) => item.id !== id);
    appData.schedules = [...scheduleArray];
  }

  updateStats();
}

function init() {
  const todoList = document.querySelector(".todoList");
  const scheduleList = document.querySelector(".scheduleList");

  const savedTodos = appData.todos;
  const savedSchedules = appData.schedules;

  if (savedTodos && savedTodos.length > 0) {
    todoListArray = [...savedTodos];
    todoListArray.forEach((item) => {
      renderItem({
        type: "todo",
        target: todoList,
        value: item.value,
        id: item.id,
        isCompleted: item.isCompleted,
        isInit: true,
      });
    });
  }

  if (savedSchedules && savedSchedules.length > 0) {
    scheduleArray = [...savedSchedules];
    scheduleArray.forEach((item) => {
      renderItem({
        type: "schedule",
        target: scheduleList,
        value: item.value,
        id: item.id,
        isCompleted: item.isCompleted,
        isInit: true,
      });
    });
  }
}
