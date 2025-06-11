//----------------------------------------//
// 📌 렌더링 모듈
//----------------------------------------//

import { state } from "./state.js";
import { updateStats } from "./stats.js";
import { setStorage } from "./storage.js";


/**
 * DOM 요소를 위한 할일목록 HTML 문자열 생성
 * @param {string} type 'todo' 또는 'schedule'
 * @param {string} value 텍스트 내용
 * @param {string} id 고유 ID
 * @param {boolean} isCompleted 할 일 완료 여부
 * @returns {string} HTML 문자열
 */
export function createItem(type, value, id, isCompleted = false) {
    return `
        <li class="${type}Item" data-id="${id}">
            <div class="checkboxWrapper">
                <input type="checkbox" id="${type}-${id}" ${isCompleted ? "checked" : ""} />
                <span class="${type}Text">${value}</span>
            </div>
            <button class="deleteBtn">❌</button>
        </li>`.trim();
}


/**
 * 화면에 할일목록 렌더링 및 전역 상태 반영
 * @param {object} param0 
 * @param {string} param0.type 'todo' 또는 'schedule'
 * @param {Element} param0.target 렌더할 리스트 요소
 * @param {object} param0.item 아이템 객체 { id, value, isCompleted }
 * @param {boolean} param0.isInit 초기 데이터 렌더링 여부
 */
export function renderItem({ 
    type, 
    target, 
    item, 
    isInit = false 
}) {
    if (!target) {
        console.error("Target element not found for:", type);
        return;
    }
    const { id, value, isCompleted = false } = item;

    const liHTML = createItem(type, value, id, isCompleted);
    const temp = document.createElement("div");
    temp.innerHTML = liHTML;
    const li = temp.firstElementChild;
    target.appendChild(li);

    if (!isInit) {
        if (type === "todo") {
            state.todoListArray.push({ id, value, isCompleted });
            state.appData.todos = [...state.todoListArray];
        } 
        else {
            state.scheduleArray.push({ id, value, isCompleted });
            state.appData.schedules = [...state.scheduleArray];
        }
        setStorage();
    }
    updateStats();
}
