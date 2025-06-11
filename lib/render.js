import { state } from "./state.js";
import { updateStats } from "./stats.js";
import { saveToLocalStorage } from "./storage.js";

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
        saveToLocalStorage();
    }
    updateStats();
}
