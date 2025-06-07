
// 하나의 할 일 항목 <li>을 문자열로 생성
function createItem(value, id){

}


// createItem을 사용해 생성된 <li>를 target 요소의 맨 뒤에 추가함
// ul 목록 안에 li가 삽입되는 구조
function renderItem({target, value, id}){

}


// 해당 data-id를 가진 <li></li> 요소를 찾아 DOM에서 제거
function removeItem(id){
    
}


// 새로운 할 일을 todoListArray에 객체 형태로 추가
// ex. { id : "123456", value : "공부하기" }
function addItemArray(id, value){

}


// 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
function removeItemArray(id){

}


// 할 일 추가 버튼을 눌렀을때 실행되는 이벤트 핸들러
// 입력값을 읽고, li 생성 및 목록 추가, 배열 저장, localStorage 저장 처리
function handleTodoList(e){

}

// <ul></ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(e){

}

// 페이지가 로드되었을때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init(){
    
}

