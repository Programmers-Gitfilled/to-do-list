// 페이지 로드 시 실행되는 메인 함수
// 날짜 표시, 이벤트 리스너 설정 등등
document.addEventListener("DOMContentLoaded", function () {
  initChart();

  init();

  const todayDate = document.querySelector(".today-date");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = days[today.getDay()];
  todayDate.textContent = `${year}-${month}-${date} ${day}`;
  const addTodoButton = document.querySelector(".add-todo-button");
  const addScheduleButton = document.querySelector(".add-schedule-button");
  const todoInput = document.querySelector(".todo-input");
  const todoList = document.querySelector(".todo-container ul");
  const scheduleInput = document.querySelector(".schedule-input");
  const scheduleList = document.querySelector(".schedule-container ul");

  // 버튼 클릭 이벤트 핸들러
  addTodoButton.addEventListener("click", function () {
    const todoText = todoInput.value.trim();

    if (todoText) {
      // 입력값이 있는 경우에만
      const id = Date.now().toString(); // 고유 ID 생성

      // renderItem 함수 호출하여 새로운 할 일 추가
      renderItem({
        target: todoList,
        value: todoText,
        id: id,
      });

      // 입력창 초기화
      todoInput.value = "";
    }
  });

  addScheduleButton.addEventListener("click", function () {
    const scheduleText = scheduleInput.value.trim();

    if (scheduleText) {
      // 입력값이 있는 경우에만
      const id = Date.now().toString(); // 고유 ID 생성

      // renderItem 함수 호출하여 새로운 할 일 추가
      renderSchedule({
        target: scheduleList,
        value: scheduleText,
        id: id,
      });

      // 입력창 초기화
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

      // todoListArray에서 해당 항목 찾아서 상태 업데이트
      const todoItem = todoListArray.find((item) => item.id === id);
      if (todoItem) {
        todoItem.isCompleted = isCompleted;
        localStorage.setItem("todos", JSON.stringify(todoListArray));
        updateStats();
      }
    }
  });
});

// 하나의 할 일 항목(<li>)을 todocontainer에 문자열로 생성
function createItem(value, id, isCompleted = false) {
  return `
    <li class="todo-item" data-id="${id}">
    <div class="checkbox-wrapper">
      <input type="checkbox" id="todo-${id}" ${isCompleted ? "checked" : ""} />
      <span class="todo-text">${value}</span>
      </div>
      <button class="delete-btn">
        ❌
      </button>
    </li>
  `.trim();
}

let todoListArray = [];

// createItem을 사용해 생성된 <li>를 target 요소의 맨 뒤에 추가함
// (ui 목록 안에 li가 삽입되는 구조)
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

// 스탯 업데이트
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

  completionChart.data.datasets[0].data = [
    completionRate,
    100 - completionRate,
  ];
  completionChart.update();
}
// 해당 data-id를 가진 <li>요소를 찾아 DOM에서 제거
function removeItem(id, type = "todo") {
  // data-id 속성으로 해당 할 일 항목 찾기
  const item = document.querySelector(`li[data-id="${id}"]`);

  // 항목이 존재하면 제거
  if (item) {
    item.remove();
  }

  if (type === "todo") {
    todoListArray = todoListArray.filter((item) => item.id !== id);
    localStorage.setItem("todos", JSON.stringify(todoListArray));
    updateStats();
  } else if (type === "schedule") {
    scheduleArray = scheduleArray.filter((item) => item.id !== id);
    localStorage.setItem("schedules", JSON.stringify(scheduleArray));
  }
}

// 페이지가 로드되었을 때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
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

let completionChart;

function initChart() {
  const ctx = document.getElementById("completionChart");
  if (!ctx) {
    console.error("Canvas element not found");
    return;
  }
  completionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["완료", "미완료"],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: [
            "#FFA14A", // 완료된 작업
            "#F1F1F1", // 남은 작업업
          ],
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

function createSchedule(value, id, isCompleted = false) {
  return `
    <li class="schedule-item" data-id="${id}">
    <div class="checkbox-wrapper">
      <input type="checkbox" id="schedule-${id}" ${
    isCompleted ? "checked" : ""
  } />
      <span class="schedule-text">${value}</span>
      </div>
      <button class="delete-btn">
        ❌
      </button>
    </li>
  `.trim();
}

let scheduleArray = [];

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
