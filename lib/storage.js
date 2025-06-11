//----------------------------------------//
// 📌 로컬스토리지 관리 모듈
//----------------------------------------//

import { state } from './state.js';


/**
 * 현재 상태를 localStorage에 저장
 */
export function setStorage() {
  const data = {
    theme: state.appData.theme,
    todos: state.todoListArray,
    schedules: state.scheduleArray,
    alertShow: state.appData.alertShow,
  };
  localStorage.setItem("appData", JSON.stringify(data));
}

/**
 * localStorage에서 상태 불러오기
 */
export function getStorage() {
  const saved = localStorage.getItem("appData");
  if (saved) {
    const parsed = JSON.parse(saved);
    state.appData = { ...state.appData, ...parsed };
    state.todoListArray = parsed.todos || [];
    state.scheduleArray = parsed.schedules || [];
  }
}
