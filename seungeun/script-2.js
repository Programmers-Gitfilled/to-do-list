// getStorage, setStorage 함수 import 해오기
import {getStorage, setStorage} from "./storage-2.js";

//이벤트가 일어날 엘리먼트들 생성하기
const form = document.querySelector("form");
const list = document.querySelector("list-container");
const input = document.querySelector("input-box");
let todoListArray = [];
//상수 선언-> localStorage에 저장될 key
const STORAGE_KEY = "todoListData";

//함수 선언 -> ui에 보여주게 하는
function createItem(id,value){
  const li = document.createElement("li");
  li.id = id;
  li.textContent = value;

  const button = document.createElement("button");
  button.textContent = '삭제';
  button.classList.add("delete-btn");
  li.appendChild(li);

  renderItem(li); //renderItem()에 보내주기
}

function renderItem(element){
  list.appendChild(element);
}

function removeItem(id){
  const item = document.getElementById(id);
  if(item){
    list.removeChild(item);
    removeItemArray(id); //스토리지 배열에서도 삭제할 수 있게 한 것 
  }
}

//todoListArray 배열에 객체 형태로 추가
function addItemArray(id,value){
  const obj = {id,value}; //객체 형태로 추가가
  todoListArray.push(obj);
  setStorage(STORAGE_KEY, todoListArray);//변경사항을 localStorage에도 반영하기
}
//배열에서 해당 id와 일치하는 항목을 제거
function removeItemArray(id){
  todoListArray = todoListArray.filter(item => item.id !== id);
  setStorage(STORAGE_KEY,todoListArray);
}

function handleTodoList(e){
  e.preventDefault();
  const value = input.value.trim();
  if(value === ''){
    alert('내용을 입력해주세요.');
  }

  const id = Date.now().toString();
  createItem(id,value);
  addItemArray(id,value);

  input.value = '';
}

//삭제 버튼 클릭 시 실행될 함수
function handleRemove(e){
  if(!e.target.classList.contains("delete-btn"))return; //e.target=>클릭된 실제 요소에 "delete-btn"클래스가 없으면 리턴

  const li = e.target.closest("li"); // 삭제버튼이 li태그 안에 들어있기 때문에 해당하는 li(조상) 찾기
  if(li){ //만약 li가 존재하면
    removeItem(li,id); //removeItem함수를 호출해 그 항목 삭제하기
   }
}
//페이지가 로드되었을 때 실행
function init(){
  getStorage(STORAGE_KEY)
}

//이벤트 연결
