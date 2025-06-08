// getStorage, setStorage 함수 import 해오기
// 쿼리 셀렉터를 이용해 이벤트가 일어날 엘리먼트들(form, list, content, todoListArray) 미리 생성해두기
// storage에 저장될 KEY 이름 const로 선언해두기

import { getStorage, setStorage } from "./lib/storage.js";

const KEY = 'todo';
const todoListArray = []; // 여기에 할 일 목록을 객체{값, 아이디}로 저장해서 setStorage에 넘김
const todoFrom = document.querySelector('.todoForm');
const todoContent = document.querySelector('.todoContent'); // 사용자가 입력창 내용 선택자
const todoList = document.querySelector('.todoList');


function getToday(){
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth()+1).toString().padStart(2,'0');
    const day = today.getDate().toString().padStart(2,'0');
    const YMD = year + month + day;
    return YMD
}

function getNextTodoId(todoData) {
    const today = getToday();

    const todayItems = todoData
        .filter(item => item.id.startsWith(today))
        .sort((a, b) => parseInt(a.id.slice(8)) - parseInt(b.id.slice(8)));

    const nextCount = todayItems.length > 0
        ? parseInt(todayItems[todayItems.length - 1].id.slice(8), 10) + 1 : 1;

    return today + nextCount.toString().padStart(3, '0');
}

// 하나의 할 일 항목 <li>을 문자열로 생성
function createItem(id, value){
    // handleTodoList에서 넘겨준 value,id를 바탕으로 엘리먼트<li> 생성하기
    // 속성 추가하기 (.innerTEXT .id .textContent 등)
    // li 자식으로 완료 버튼도 만들어주기
    // 다 만든 자식을 화면에 띄울 수 있게 renderItem()에 보내주기
    const li = document.createElement('li');
    li.dataset.id = id;
    li.textContent = value;
    const doneBtn = document.createElement('button');    
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
function renderItem(element){
    // ul태그 자식으로 createItem에서 받아온 li태그를 넣어주기
    todoList.appendChild(element);
}


// 해당 data-id를 가진 <li></li> 요소를 찾아 DOM에서 제거
function removeItem(id){
    // handleRemove에서 넘겨준 삭제할 target.id에 맞는 child를 삭제하기
    // element를 삭제했다면 removeItemArray()에 id 넘겨줘서 스토리지 배열에서도 삭제할 수 있도록하기
    const li = document.querySelector(`[data-id="${id}"]`);
    if(li) {
        todoList.removeChild(li);
        removeItemArray(id);
    }
}


// 새로운 할 일을 todoListArray에 객체 형태로 추가
// ex. { id : "123456", value : "공부하기" }
function addItemArray(id, value){
    // handleTodoList에서 넘겨준 id, value 쌍을 객체 형태로 만들기 (obj={id,value})
    // todoListArray에 추가해주기 (push(obj))
    // todoListArray의 변경사항을 진짜 localStorage에 반영할 수 있게 setStorage에 내역 보내기
    const todo = { id, value };
    todoListArray.push(todo);
    setStorage(KEY, todoListArray);
}



// 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
function removeItemArray(id){
    // 받아온 id와 일치하는 value찾기 -> filter 사용
    // 해당 value를 todoList 배열에서 삭제하고
    // 삭제한 리스트의 상태를 setStorage()로 반영하기
    todoListArray.splice(0, todoListArray.length, ...todoListArray.filter(todo => todo.id !== id));
    //todoListArray = todoListArray.filter( todo => todo.id !== id );
    setStorage(KEY, todoListArray);
}


// 할 일 추가 버튼을 눌렀을때 실행되는 이벤트 핸들러
// 입력값을 읽고, li 생성 및 목록 추가, 배열 저장, localStorage 저장 처리
function handleTodoList(e){
    // e.preventDefault();
    // enter를 누르거나 +를 누르는 등의 이벤트가 발생했을때 실행될 함수
    // 사용자가 화면에 입력한 값을 받아오기 -> value
    // 해당 todo에 대해서 id 생성해주기
    // createItem으로 value,id 쌍 넘겨주기 -> element 생성
    // addItemArray()에 value,id 넘겨주기 -> todoList 배열에 넣어서 local storage에 저장하기 위함.
    const value = todoContent.value;
    if (!value) return;
    const id = getNextTodoId(todoListArray);
    createItem(id, value);
    addItemArray(id,value);
}

// <ul></ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(e){
    // 삭제 버튼을 눌렀을때 실행될 함수
    // 삭제버튼이 li태그 안에 들어있기 때문에 해당하는 li(조상) 찾기
    // 조상 찾았다면 li태그를 지우기 위해 removeItem()에 target.id 넘겨주기
    const li = e.target.closest('li');
    if (!li) return;
    removeItem(li.dataset.id);
}

// 페이지가 로드되었을때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init(){
    // 기존에 저장된 데이터 있는지 storage.js의 promise 반환 함수 사용
    // 초기 상태인 경우도 예외 처리 (아직 투두리스트 입력 자체를 안해서 KEY가 생기지 않은 경우 빈 배열인 상태로 만들어주기)
    // 있다면 그 정보를 배열로 받아서 리스트로 보여지게 -> createItem에 넣어주기
    // 없다면 예외처리도
    getStorage(KEY)
        .then( data => {
            const todoData = JSON.parse(data) || '[]'; // JSON.parse 안해주면 안가져와진다
            todoData.forEach( todo => {
                createItem(todo.id, todo.value);  
                todoListArray.push(todo);   // 이거 안해주면 화면에 계속 목록이 하나만 나타남           
            });
            getNextTodoId(todoData);
            
        })
        .catch((error) => {
            console.error('투두리스트 가져오기에 실패했습니다 ', error);
        })
    
}



// init()함수 실행 <- 페이지 로딩 위함
// 클릭 이벤트 등 처리 (form에 계획 입력 이벤트, 완료 버튼 이벤트)
init();
todoFrom.addEventListener('submit',handleTodoList);
todoList.addEventListener('click',(e)=>{
    if(e.target.classList.contains('doneBtn')){
        handleRemove(e);
    }
})