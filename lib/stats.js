//----------------------------------------//
// 📌 통계 및 상태 업데이트 모듈
//----------------------------------------//

import { state } from "./state.js";
import { updateChart } from "./chart.js";
import { setStorage } from "./storage.js";


/**
 * 전역 상태를 바탕으로 리스트 갯수, 퍼센트 계산 후 차트 수치 업데이트
 */
export function updateStats() {
    const todoCnt = state.todoListArray.length;
    const todoDoneCnt = state.todoListArray.filter(i => i.isCompleted).length;
    const scheduleCnt = state.scheduleArray.length;
    const scheduleDoneCnt = state.scheduleArray.filter(i => i.isCompleted).length;

    const totalCnt = todoCnt + scheduleCnt;
    const totalDone = todoDoneCnt + scheduleDoneCnt;
    const totalRemain = totalCnt - totalDone;
    const totalRate = totalCnt === 0 ? 0 : Math.round((totalDone / totalCnt) * 100);

    if (totalRate === 100 && totalCnt > 0 && state.appData.alertShow !== true) {
        alert("🔥 할 일 완료 !");
        state.appData.alertShow = true;
    } else if (totalRate < 100) {
        state.appData.alertShow = false;
    }

    document.querySelector(".totalCount").textContent = totalCnt;
    document.querySelector(".completedCount").textContent = totalDone;
    document.querySelector(".rate").textContent = `${totalRate}%`;

    updateChart(todoDoneCnt, scheduleDoneCnt, totalRemain);
    setStorage();
}
