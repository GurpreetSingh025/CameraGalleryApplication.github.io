let video = document.querySelector("video");
let actionCont = document.querySelector(".action-cont");
let recordDivElem = actionCont.querySelector(".record-btn-cont");
let captureDivElem = actionCont.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn") ;
let captureBtn = document.querySelector(".capture-btn") ;
let shareScreenBtn = document.querySelector(".screen-share-btn");
let recorder ;
let chunks = [];
let counterCont = document.querySelector(".counter-cont");
 
let stop_and_play_recording = false; // agr ya variable false h iska
 // mtlb recording bnd h aur agr ya variable true h mtlb recording chl rhi h

let constraints = {
    video : true ,
    audio : false 
}

// let shareScreenConstraint = {
//     video : {
//         mediaSource : "screen",
//     },
// }

// shareScreenBtn.addEventListener("click" , (e) => {
//     let start = async () => {
//         let stream = await navigator.mediaDevices.getDisplayMedia(shareScreenConstraint);
//         video.srcObject = stream;
//     }

//     start();
// })

//getusermedia returns a promise 
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream ;
   
    //MediaRecorder ek web api h ....iss sa recording ki functionality mill jati h
    //iss ko use krna k liya MediaRecorder ka object bnao aur usma
    //stream pass krr do.
  
    recorder = new MediaRecorder(stream);

    //Jo stream hoti h usma data ek sath nhi aata
    //Streams ma data tukdo ma aata h inn tukdo ko chunks bolta h
    //isliya chunks naam ka array bnaya h jisma data pda hua h

    recorder.addEventListener("start" , (e) => {
        chunks = [];    
        counterCont.style.display = "block";
    })
    recorder.addEventListener("dataavailable" , (e) => {
        // event ka object ka andr data pda hua h 
         chunks.push(e.data);
    });
    recorder.addEventListener("stop" , (e) => {
       
        //blob is used to donwload something . 
        //blob takes an array and object where we define 
        //the type of downloading data (like mp4 , mp3 etc.)

        let blob = new Blob(chunks , {type : "video/mp4"});
        
        
        if(db){
             let videoId = shortid();
             let dbTransaction = db.transaction("video" , "readwrite");
             let videoStore = dbTransaction.objectStore("video");
             
             let videoEntry = {
                 id : `vid ${videoId}` ,
                 data : blob
             }

             videoStore.add(videoEntry);
        }

        // let UrlOfRecording = URL.createObjectURL(blob);
        // let aTag = document.createElement("a");
        // aTag.href = UrlOfRecording;
        // aTag.download = "stream.mp4";
        // aTag.click();
    })
})

// Jbb bhi record-btn-cont vala area pr click hoga toh recording
//start ho jayegi and recording ka animation bhi start ho jayega
recordDivElem.addEventListener("click" , (e) => {
     //recorder tbb milaga jbb promise apna kaam pura karega
     //agr promise ka kaam pura krna sa pehla recording start hui
     //toh return ho jayega kyuki tbb recording variable ma kuch
     // bhi nhi hoga.

     if(!recorder){return;}
   
     stop_and_play_recording = !stop_and_play_recording;

     if(stop_and_play_recording){
         recordBtn.classList.add("recordAnimation");
         recorder.start();
         alert("recording Started");
     }else{
         recordBtn.classList.remove("recordAnimation");
         recorder.stop();
         alert("recording Stopped");
     }
})

let canvasColor = "transparent" ;

//stream ma video h pr video ma sa ek image capture krna k liya
//canvas use hota h.
captureBtn.addEventListener("click" , (e) => {
     let canvas = document.createElement("canvas");
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;          
     
     let tools = canvas.getContext("2d"); 

     tools.fillStyle = canvasColor;
     tools.fillRect( 0 ,0 , video.videoWidth , video.videoHeight );

     tools.drawImage(video,0 , 0 , video.videoWidth , video.videoHeight);         
     
     let imageDownloadUrl = canvas.toDataURL();
      
     if(db){
        let imgId = shortid();
        let imgTransaction = db.transaction("image" , "readwrite");
        let imageStore = imgTransaction.objectStore("image");
        let imageEntry = {
             id : `img ${imgId}` ,
             url : imageDownloadUrl 
        }

        imageStore.add(imageEntry);
     }

      let a = document.createElement('a');
      a.href= imageDownloadUrl;
      a.download = "image.jpg";
      a.click();
}); 

// Apply selected filter color to screen 

let filteringLayer = document.querySelector(".filtering-layer");
let allFilterColors = document.querySelectorAll(".filter");
 
allFilterColors.forEach((filterColor) => {
    filterColor.addEventListener("click" , (e) => {
        //jbb bhi kisi element ki style ko get krna hota h toh get computed style use krta h
        //getComputedStyle ma vo element btaega jiski style access krni h . getPropertyValue ma uss element ki koi property chaiya hogi
        canvasColor = getComputedStyle(filterColor).getPropertyValue("background-color");
        filteringLayer.style.backgroundColor = canvasColor;
    })
});

//Setting counter whenever record button pressed 

// let counterCont = document.querySelector(".counter-cont");
// let counter = document.querySelector(".counter");
// let counterValue = 0;

// function startCounter(){
//    counterValue += 1;        
// }

let galleryElem = document.querySelector(".gallery");
galleryElem.addEventListener("click" , (e) => {
    //location.assign sa dusra page ma ja sakta h
    location.assign("gallery.html");
});
