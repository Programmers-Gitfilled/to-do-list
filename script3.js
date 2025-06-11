//변수 선언부
let completionChart;
let todoListArray = [];
let scheduleArray = [];
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

//localStorage 저장 데이터
let appData = {
  theme: "light",
  todos: [],
  schedules: [],
  alertShow: false,
};


//테마
//렌더링
//로컬에 저장된 데이터 테마 불러오기 및 설정정
function updateChartTheme() {
  if (!completionChart) return;

  const currentTheme = body.getAttribute("data-theme");
  const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

  completionChart.data.datasets[0].backgroundColor[2] = backgroundColor;
  completionChart.update();
}

//테마
//테마 상태 변경
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

//테마
//테마 변경 토글 클릭 이벤트
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = appData.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });
}
//DOM 객체 이벤트 처리
document.addEventListener("DOMContentLoaded", function () {
  setTheme("light");

  initChart();
  init();
  getToday();

  const addTodoButton = document.querySelector(".add-todo-button");
  const addScheduleButton = document.querySelector(".add-schedule-button");
  const todoInput = document.querySelector(".todo-input");
  const todoList = document.querySelector(".todolist");
  const scheduleInput = document.querySelector(".schedule-input");
  const scheduleList = document.querySelector(".schedulelist");

  //리스트 입력
  //할 일 입력시 해당 내용 렌더링 함수에 전달
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

  //리스트 입력
  //할 일 읿력시 해당 내용 렌더링 함수에 전달
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

  //리스트 입력
  //엔터 눌렀을 때 기본으로 Todo에 저장
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
//리스트 입력
//투두,스케줄 입력 후 해당 버튼 클릭시 마우스 이벤트 동작 
  if (todoList) {
    todoList.addEventListener("click", (e) => handleRemove(e, "todo"));
  }
  if (scheduleList) {
    scheduleList.addEventListener("click", (e) => handleRemove(e, "schedule"));
  }
//리스트 항목
//리스트 항목에 체크 표시할 시 css 애니메이션 동작 및 진행률 상태 반영
  if (todoList) {
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

//함수 선언

//진행률 차트 기본 정보 가져오기
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
//리스트 항목 삭제 핸들러
function handleRemove(e, type) {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest(`.${type}-item`);
    if (li) {
      const id = li.dataset.id;
      removeItem(id, type);
    }
  }
}
//리스트 항목 완료표시 핸들러
function handleChange(e, type) {
  if (e.target.type === "checkbox") {
    const li = e.target.closest(`.${type}-item`);
    if (li) {
      const id = li.dataset.id;
      const isCompleted = e.target.checked;
      return [id, isCompleted];
    }
  }
  return [null, null];
}
//오늘 날짜 가져오기
function getToday() {
  const todayDate = document.querySelector(".today-date");
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
//리스트 항목 태그 생성
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

//리스트 항목 태그 렌더링 및 진행률 업데이트
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
  }

  updateStats();
}

//진행 상태 통계 업데이트 함수 
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

  //전체 달성률 계산 
  const totalRate =
    totalCnt === 0 ? 0 : Math.round((totalDone / totalCnt) * 100);

  //달성률이 100%일 경우 알림 표시(중복 표시 방지)
  if (totalRate === 100 && totalCnt > 0 && appData.alertShow !== true) {
    alert("🔥 할 일 완료 !");
    appData.alertShow = true;
  } else if (totalRate < 100) {
    appData.alertShow = false;
  }

  const totalCountEl = document.querySelector(".total-count");
  const completedCountEl = document.querySelector(".completed-count");
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
}

// 항목 제거 함수 
function removeItem(id, type) {
  const item = document.querySelector(`li[data-id="${id}"]`);

  if (item) {
    item.remove();
  }

  //항목 type이 "todo"일 경우
  if (type === "todo") {
    todoListArray = todoListArray.filter((item) => item.id !== id);
    appData.todos = [...todoListArray];
    updateStats();
  }

  //항목 type이 "schedule"일 경우
  if (type === "schedule") {
    scheduleArray = scheduleArray.filter((item) => item.id !== id);
    appData.schedules = [...scheduleArray];
    updateStats();
  }
}


//초기화 함수 
function init() {
  const todoList = document.querySelector(".todolist");
  const scheduleList = document.querySelector(".schedulelist");

  const savedTodos = appData.todos;
  const savedSchedules = appData.schedules;

  //저장된 할 일 & 스케줄 데이터가 존재할 경우 화면에 렌더링
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
