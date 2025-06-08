/*------------------완성 코드------------------------*/
import { getStorage, setStorage } from "./lib/storage.js";

const KEY = 'todo';
const todoListArray = [];
const form = document.querySelector('.todoForm');
const list = document.querySelector('.todoList');
const content = document.querySelector('.todoContent')

// [
// obj1{},
// obj2{},
// obj3{},
// ]



// init();
// handleTodoList() -> createItem(), addItemArray() -> renderItem(), setStorage();
// handleRemove() -> removeItem() -> removeItemArray() -> setStorage();


// 하나의 할 일 항목 <li>을 문자열로 생성
function createItem(value, id){
    const li = document.createElement('li');
    li.textContent = value;
    li.id = id;
    li.dataset.id=id;

    const doneBtn = document.createElement('button');
    doneBtn.innerText = '✅';
    doneBtn.classList.add('doneBtn');
    doneBtn.innerHTML = `<svg class="doneBtn w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path class="doneBtn" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
</svg>
`

    li.appendChild(doneBtn);
    renderItem(li);
}


// createItem을 사용해 생성된 <li>를 target 요소의 맨 뒤에 추가함
// ul 목록 안에 li가 삽입되는 구조
function renderItem(item){
    list.appendChild(item)
}


// 해당 data-id를 가진 <li></li> 요소를 찾아 DOM에서 제거
function removeItem(id){
    const target = document.querySelector(`[data-id="${id}"]`);
    if(target) {
        list.removeChild(target);
        removeItemArray(id);
    }
    
}


// 새로운 할 일을 todoListArray에 객체 형태로 추가
// ex. { id : "123456", value : "공부하기" }
function addItemArray(id, value){
    const newTodo = {id, value};
    todoListArray.push(newTodo);
    setStorage(KEY, todoListArray);

}


// 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
function removeItemArray(id){
    const index = todoListArray.findIndex(item => item.id === id);
    if (index !== -1 ){
        todoListArray.splice(index, 1);
        setStorage(KEY, todoListArray);
    }
}


// 할 일 추가 버튼을 눌렀을때 실행되는 이벤트 핸들러
// 입력값을 읽고, li 생성 및 목록 추가, 배열 저장, localStorage 저장 처리
const handleTodoList = (e) => {
    e.preventDefault();
    const value = content.value;
    if(!value) return;

    const id = String(Date.now());
    createItem(value, id);
    addItemArray(id, value);

    content.value = '';
}

// <ul></ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(e){
    // closest() : 조건에 부합하는 가장 가까운 조상을 찾아서 반환
    const target = e.target.closest('li'); 
    if(!target) return; // 조상이 없는 경우 예외 처리
    removeItem(target.dataset.id); 
}



// 페이지가 로드되었을때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init(){
    // 프로미스 객체를 반환하는 함수를 사용
    getStorage(KEY)
        .then( data => {
            const todo = JSON.parse(data || '[]'); // 아무것도 생성하지 않았을때 예외 처리
            // console.log('todo : ', todo);
            todo.forEach(item => {
                createItem(item.value, item.id);
                todoListArray.push(item);
            })
        })
        .catch((error) => {
            console.error('로컬스토리지 가져오기 실패 : ', error);
                
        });
}


init();
form.addEventListener('submit',handleTodoList);

list.addEventListener('click', (e) => {
  if (e.target.classList.contains('doneBtn')) { // 완료 버튼을 눌렀을때
        handleRemove(e); // 삭제 수행하기
  }
});
