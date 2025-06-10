// 페이지 로드 시 실행되는 메인 함수
// 날짜 표시, 이벤트 리스너 설정 등등
document.addEventListener("DOMContentLoaded", function () {
  initChart();
  init();
  getToday();

  const addTodoButton = document.querySelector(".add-todo-button");
  const addScheduleButton = document.querySelector(".add-schedule-button");
  const todoInput = document.querySelector(".todo-input");
  const todoList = document.querySelector(".todolist");
  const scheduleInput = document.querySelector(".schedule-input");
  const scheduleList = document.querySelector(".schedulelist");

  addTodoButton.addEventListener("click", function () {
    const todoText = todoInput.value.trim();
    if (todoText) {
      const id = Date.now().toString(); // 고유 ID 생성
      renderItem({
        type: "todo",
        target: todoList,
        value: todoText,
        id: id,
      });
      todoInput.value = "";
    }
  });

  addScheduleButton.addEventListener("click", function () {
    const scheduleText = scheduleInput.value.trim();
    if (scheduleText) {
      const id = Date.now().toString(); // 고유 ID 생성
      renderItem({
        type: "schedule",
        target: scheduleList,
        value: scheduleText,
        id: id,
      });
      scheduleInput.value = "";
    }
  });

  todoList.addEventListener("click", (e) => handleRemove(e, "todo"));
  scheduleList.addEventListener("click", (e) => handleRemove(e, "schedule"));

  todoList.addEventListener("change", (e) => {
    const [id, isCompleted] = handleChange(e, "todo");
    // todoListArray에서 해당 항목 찾아서 상태 업데이트
    const todoItem = todoListArray.find((item) => item.id === id);
    if (todoItem) {
      todoItem.isCompleted = isCompleted;
      localStorage.setItem("todos", JSON.stringify(todoListArray));
      updateStats();
    }
  });

  scheduleList.addEventListener("change", (e) => {
    const [id, isCompleted] = handleChange(e, "schedule");

    // scheduleArray에서 해당 항목 찾아서 상태 업데이트
    const scheduleItem = scheduleArray.find((item) => item.id === id);
    if (scheduleItem) {
      scheduleItem.isCompleted = isCompleted;
      localStorage.setItem("schedules", JSON.stringify(scheduleArray));
      updateStats();
    }
  });
});

function handleRemove(e, type) {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest(`.${type}-item`);
    const id = li.dataset.id;
    removeItem(id, type);
  }
}

function handleChange(e, type) {
  if (e.target.type === "checkbox") {
    const li = e.target.closest(`.${type}-item`);
    const id = li.dataset.id;
    const isCompleted = e.target.checked;
    return [id, isCompleted];
  }
}

function getToday() {
  const todayDate = document.querySelector(".today-date");
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = days[today.getDay()];
  todayDate.textContent = `${year}. ${month}. ${date} ${day}`;
}

function createItem(type, value, id, isCompleted = false) {
  return `
    <li class="${type}-item" data-id="${id}">
    <div class="checkbox-wrapper">
      <input type="checkbox" id="${type}-${id}" ${
    isCompleted ? "checked" : ""
  } />
      <span class="${type}-text">${value}</span>
      </div>
      <button class="delete-btn">
        ❌
      </button>
    </li>
  `.trim();
}

let todoListArray = [];
let scheduleArray = [];

function renderItem({
  type,
  target,
  value,
  id,
  isCompleted = false,
  isInit = false,
}) {
  const liHTML = createItem(type, value, id, isCompleted);
  const temp = document.createElement("div");
  temp.innerHTML = liHTML;
  const li = temp.firstElementChild;
  target.appendChild(li);

  if (!isInit) {
    if (type === "todo") {
      todoListArray.push({ id, value, isCompleted });
      localStorage.setItem("todos", JSON.stringify(todoListArray));
    }
    if (type === "schedule") {
      scheduleArray.push({ id, value, isCompleted });
      localStorage.setItem("schedules", JSON.stringify(scheduleArray));
    }
  }

  updateStats();
}

// 스탯 업데이트
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

  //달성률 100이면 alert 창 띄우기
  if (
    totalRate === 100 &&
    totalCnt > 0 &&
    localStorage.getItem("alertShow") !== "true"
  ) {
    alert("🔥 할 일 완료 !");
    localStorage.setItem("alertShow", "true");
  } else if (totalRate < 100) {
    localStorage.setItem("alertShow", "false");
  }

  document.querySelector(".total-count").textContent = totalCnt;
  document.querySelector(".completed-count").textContent = totalDone;
  document.querySelector(".rate").textContent = `${Math.round(totalRate)}%`;

  completionChart.data.datasets[0].data = [
    todoDoneCnt,
    scheduleDoneCnt,
    totalRemain,
  ];
  completionChart.update();
}

// 해당 data-id를 가진 <li>요소를 찾아 DOM에서 제거
function removeItem(id, type) {
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
  }

  if (type === "schedule") {
    scheduleArray = scheduleArray.filter((item) => item.id !== id);
    localStorage.setItem("schedules", JSON.stringify(scheduleArray));
    updateStats();
  }
}

// 페이지가 로드되었을 때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init() {
  const todoList = document.querySelector(".todolist");
  const scheduleList = document.querySelector(".schedulelist");
  const savedTodos = localStorage.getItem("todos");
  const savedSchedules = localStorage.getItem("schedules");
  if (savedTodos) {
    todoListArray = JSON.parse(savedTodos);
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

  if (savedSchedules) {
    scheduleArray = JSON.parse(savedSchedules);
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

let completionChart;

// 통계(달성률) 도넛 차트를 초기화하고 렌더링링
function initChart() {
  const ctx = document.getElementById("completionChart");
  if (!ctx) {
    console.error("Canvas element not found");
    return;
  }
  completionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["todos", "schedules", "incomplete"],
      datasets: [
        {
          data: [0, 0, 100],
          backgroundColor: [
            "#2D67FF", // 완료한 todo
            "#f8dd63", // 완료한 schedule
            "#FAFAFA", // 미완료
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
