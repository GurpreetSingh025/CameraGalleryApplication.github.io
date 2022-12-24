//There are follwing steps to work with indexdb
// 1) open database 
//    open database ma apn ek database open kraga jisma videos aur images store krr ska

// 2) create objectStore
// Jsa sql ma tables ki form ma data store hota h vsa hi indexedDb ma objectstore ki form ma data store hoga

// 3) make transactions.
//transactions sa apn data le payega from indexedDb . 
//transaction ma 2 tarah ka operation hota h pehla read . read mtlb sirf data read kraga ya fir data read krka display krva daga.
// 2nd operation is readwrite jha pr hum data read bhi krna chahta h aur usma kuch changes bhi krna chahta h.

//indexed db ma hrr kaam asynchronous hota h aur events ki form ma hota h , isliya baar baar eventListener ka use krna pdega while working with indexed db

let db ;
let openRequest = indexedDB.open("myDb");

//agr database successfully open ho gya toh success vala event trigger hoga
openRequest.addEventListener("success" , (e) => {
   db = openRequest.result;
});

//agr database open nhi ho paya , database open hona ma koi faliure aaya toh error vala eventListener chlaga
openRequest.addEventListener("error" , (e) => {
     console.log("db error");     
});

//agr database ma koi bhi changes kiya ya jbb bhi open kiya hua database ka version change kiya toh upgradeneeded event trigger hoga
//objectstore hamesha upgradeneeded pr hi create hoga.

openRequest.addEventListener("upgradeneeded" , (e) => {
   db = openRequest.result;   

   //apn recorded video aur captured image store krna chahta h toh 2 objectstore create hoga one for video and another for image

   //createObjectStore 2 parameters laga . first is name of objectStore and second is unique id
   db.createObjectStore("video" , {keyPath : "id"});
   db.createObjectStore("image" , {keyPath : "id"});
})


