//작성한 함수 export 해주기
export { getStorage, setStorage };

function getStorage(key){
  return new Promise((resolve,reject)=>{
    try{
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }
    catch(error){
      reject(error);
    }
  });
}

function setStorage(key,data){
  try{
    localStorage.setItem(key, JSON.stringify(data));
  }
  catch(error){
    console.error('저장 중 에러입니다.',error);
  }
}