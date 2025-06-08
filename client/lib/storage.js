// 작성한 함수 export 해주기
export {getStorage, setStorage}

function getStorage(KEY){
    // 스토리지에서 값을 가져오는 역할 => 값을 반환하는 함수
    // init()때 로드(새로고침)되면서 내용 가져오는 역할로 주로 쓰임
    // 스토리지 내부에 KEY(=어디에)자체가 만들어지지 않았다면 에러
    return new Promise((resolve, reject) => {
        try {
            const value = localStorage.getItem(KEY);
            resolve(value)
        } catch(error) { 
            reject(error) 
        } 
    })
    
}

function setStorage(KEY, value){
    // 스토리지에 값을 저장하는 역할 => 값 반환X, 스토리지 상에서 저장됐는지 변화 확인 가능
    // 저장 못했다면 에러처리
    try{
        localStorage.setItem(KEY,JSON.stringify(value));
    }
    catch (error) {
        console.error('로컬 저장 실패', error);
    }
    
}
