// 페이지 로드 시 실행되는 메인 함수
// 날짜 표시, 이벤트 리스너 설정 등등
document.addEventListener("DOMContentLoaded", function () {
  initChart();
  init();
  getToday();

  const addTodoButton = document.querySelector(".add-todo-button");
  const addScheduleButton = document.querySelector(".add-schedule-button");
  const todoInput = document.querySelector(".todo-input");
  const scheduleInput = document.querySelector(".schedule-input");
  const todoList = document.querySelector(".todo-container ul");
  const scheduleList = document.querySelector(".schedule-container ul");

  addTodoButton.addEventListener("click", function () {
    const todoText = todoInput.value.trim();
    if (todoText) {
      const id = Date.now().toString();
      renderItem({ target: todoList, value: todoText, id });
      todoInput.value = "";
    }
  });

  addScheduleButton.addEventListener("click", function () {
    const scheduleText = scheduleInput.value.trim();
    if (scheduleText) {
      const id = Date.now().toString();
      renderSchedule({ target: scheduleList, value: scheduleText, id });
      scheduleInput.value = "";
    }
  });

  todoList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const li = e.target.closest(".todo-item");
      const id = li.dataset.id;
      removeItem(id, "todo");
    }
  });

  scheduleList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const li = e.target.closest(".schedule-item");
      const id = li.dataset.id;
      removeItem(id, "schedule");
    }
  });

  todoList.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      const li = e.target.closest(".todo-item");
      const id = li.dataset.id;
      const isCompleted = e.target.checked;
      const todoItem = todoListArray.find((item) => item.id === id);
      if (todoItem) {
        todoItem.isCompleted = isCompleted;
        localStorage.setItem("todos", JSON.stringify(todoListArray));
        updateStats();
      }
    }
  });

  scheduleList.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      const li = e.target.closest(".schedule-item");
      const id = li.dataset.id;
      const isCompleted = e.target.checked;
      const scheduleItem = scheduleArray.find((item) => item.id === id);
      if (scheduleItem) {
        scheduleItem.isCompleted = isCompleted;
        localStorage.setItem("schedules", JSON.stringify(scheduleArray));
      }
    }
  });
});

function getToday() {
  const todayDate = document.querySelector(".today-date");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = days[today.getDay()];
  todayDate.textContent = `${year}-${month}-${date}-${day}`;
}

function createItem(value, id, isCompleted = false) {
  return `
    <li class="todo-item" data-id="${id}">
      <div class="checkbox-wrapper">
        <input type="checkbox" id="todo-${id}" ${
    isCompleted ? "checked" : ""
  } />
        <span class="todo-text">${value}</span>
      </div>
      <button class="delete-btn">❌</button>
    </li>
  `.trim();
}

function createSchedule(value, id, isCompleted = false) {
  return `
    <li class="schedule-item" data-id="${id}">
      <div class="checkbox-wrapper">
        <input type="checkbox" id="schedule-${id}" ${
    isCompleted ? "checked" : ""
  } />
        <span class="schedule-text">${value}</span>
      </div>
      <button class="delete-btn">❌</button>
    </li>
  `.trim();
}

let todoListArray = [];
let scheduleArray = [];
let completionChart;

function renderItem({
  target,
  value,
  id,
  isCompleted = false,
  isInit = false,
}) {
  const liHTML = createItem(value, id, isCompleted);
  const temp = document.createElement("div");
  temp.innerHTML = liHTML;
  const li = temp.firstElementChild;
  target.appendChild(li);

  if (!isInit) {
    todoListArray.push({ id, value, isCompleted });
    localStorage.setItem("todos", JSON.stringify(todoListArray));
  }

  updateStats();
}

function renderSchedule({
  target,
  value,
  id,
  isCompleted = false,
  isInit = false,
}) {
  const liHTML = createSchedule(value, id, isCompleted);
  const temp = document.createElement("div");
  temp.innerHTML = liHTML;
  const li = temp.firstElementChild;
  target.appendChild(li);

  if (!isInit) {
    scheduleArray.push({ id, value, isCompleted });
    localStorage.setItem("schedules", JSON.stringify(scheduleArray));
  }
}

function updateStats() {
  const totalCount = todoListArray.length;
  const completedCount = todoListArray.filter(
    (item) => item.isCompleted
  ).length;
  const completionRate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  document.querySelector(".total-count").textContent = totalCount;
  document.querySelector(".completed-count").textContent = completedCount;
  document.querySelector(".rate").textContent = `${completionRate}%`;

  if (completionChart) {
    completionChart.data.datasets[0].data = [
      completionRate,
      100 - completionRate,
    ];
    completionChart.update();
  }
}

function removeItem(id, type = "todo") {
  const item = document.querySelector(`li[data-id="${id}"]`);
  if (item) item.remove();

  if (type === "todo") {
    todoListArray = todoListArray.filter((item) => item.id !== id);
    localStorage.setItem("todos", JSON.stringify(todoListArray));
    updateStats();
  } else if (type === "schedule") {
    scheduleArray = scheduleArray.filter((item) => item.id !== id);
    localStorage.setItem("schedules", JSON.stringify(scheduleArray));
  }
}

function init() {
  const todoList = document.querySelector(".todo-container ul");
  const scheduleList = document.querySelector(".schedule-container ul");
  const savedTodos = localStorage.getItem("todos");
  const savedSchedules = localStorage.getItem("schedules");

  if (savedTodos) {
    todoListArray = JSON.parse(savedTodos);
    todoListArray.forEach((item) => {
      renderItem({
        target: todoList,
        value: item.value,
        id: item.id,
        isCompleted: item.isCompleted,
        isInit: true,
      });
    });
  }

  if (savedSchedules) {
    scheduleArray = JSON.parse(savedSchedules);
    scheduleArray.forEach((item) => {
      renderSchedule({
        target: scheduleList,
        value: item.value,
        id: item.id,
        isCompleted: item.isCompleted,
        isInit: true,
      });
    });
  }
}

function initChart() {
  const ctx = document.getElementById("completionChart");
  if (!ctx) return;

  completionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["완료", "미완료"],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#FFA14A", "#F1F1F1"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "80%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
    },
  });
}
