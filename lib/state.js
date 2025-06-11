//----------------------------------------//
// 📌 상태 관리 모듈 (전역 상태 저장소)
//----------------------------------------//

/**
 * 앱의 전역 상태를 관리하는 객체
 */
export const state = {
  completionChart: null,
  todoListArray: [],
  scheduleArray: [],
  appData: {
    theme: "light",
    todos: [],
    schedules: [],
    alertShow: false,
  }
};
