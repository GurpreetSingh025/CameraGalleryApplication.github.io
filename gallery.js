let vidUrl;
let imageUrl ;
setTimeout( () => {
    if(db){
        let dbTransaction = db.transaction("video" , "readonly");
        let dbStore = dbTransaction.objectStore("video");
        let videoRequest = dbStore.getAll();
        console.log(videoRequest);

        videoRequest.onsuccess = () => {
              videoResult = videoRequest.result;
              console.log(videoResult);

              videoResult.forEach( (videoObj) => {
                console.log(videoObj.id);
                vidUrl = URL.createObjectURL(videoObj.data);
                // console.log(url);                  
                
                let mediaContElem = document.createElement("div");
                mediaContElem.setAttribute("class" , "media-cont") ;
                mediaContElem.setAttribute("id" , `${videoObj.id}`);
                mediaContElem.innerHTML = 
                 `   <div class="media">
                       <video src= ${vidUrl} autoplay loop controls></video>
                     </div>

                     <div class="download videoDownload">Download</div>
                     <div class="delete">Delete</div>
                  ` ;

                 let galleryContElem = document.querySelector(".gallery-cont");
                 galleryContElem.appendChild(mediaContElem);                 
                 
             });                           

             let allDownloadElem = document.querySelectorAll(".videoDownload");

             allDownloadElem.forEach((downloadElem) => {
                   
                   downloadElem.addEventListener("click" , (e) => {
                         let aElem = document.createElement("a") ;
                         aElem.href = vidUrl;
                         aElem.download = "video.mp4";
                         aElem.click();
                   });
             });

             let allDeleteElem = document.querySelectorAll(".delete");
             allDeleteElem.forEach((deleteElem) => {
                  deleteElem.addEventListener("click" , (e) => {
                      let deleteId = deleteElem.parentElement.getAttribute("id");  
                      let mediaContOfDelete = deleteElem.parentElement;
                      mediaContOfDelete.style.display = "none";  
                      deleteElemFromIndexedDb(deleteId);
                  });
             });
             
        }

        let imageDbTransaction = db.transaction("image" , "readonly");
        let imageObjectStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageObjectStore.getAll();

        imageRequest.onsuccess = () => {
             let imageResult = imageRequest.result;
             
             imageResult.forEach( (imageObject) => {
                  imageUrl = imageObject.url ;
                //   console.log(imageUrl);

                  let mediaContElem = document.createElement("div");
                  mediaContElem.setAttribute("class" , "media-cont") ;
                  mediaContElem.setAttribute("id" , `${imageObject.id}`);
                  mediaContElem.innerHTML = 
                   `   <div class="media">
                         <img src= ${imageUrl} ></video>
                       </div>
  
                       <div class="download imageDownload">Download</div>
                       <div class="delete">Delete</div>
                    ` ;
                    
                   let galleryContElem = document.querySelector(".gallery-cont");
                   galleryContElem.appendChild(mediaContElem);
             })
             
             let allDownloadElem = document.querySelectorAll(".imageDownload");
             allDownloadElem.forEach( (downloadElem) => {
                  downloadElem.addEventListener("click" , (e) => {
                        let aElem = document.createElement("a");
                        aElem.href = imageUrl;
                        aElem.download = "caturedImage.jpg";
                        aElem.click();
                  });
             });

             let allDeleteElem = document.querySelectorAll(".delete");
             allDeleteElem.forEach((deleteElem) => {
                  deleteElem.addEventListener("click" , (e) => {
                      let deleteId = deleteElem.parentElement.getAttribute("id");  
                      let mediaContOfDelete = deleteElem.parentElement;
                      mediaContOfDelete.style.display = "none";  
                      deleteElemFromIndexedDb(deleteId);
                  });
             });
             
        };     
        
    }
} , 1000) ;


function deleteElemFromIndexedDb(deletedId){
     
    if(deletedId.slice(0,3) === "vid"){
        let dbTransaction = db.transaction("video" , "readwrite");
        let dbStore = dbTransaction.objectStore("video");
        dbStore.delete(deletedId);        
    }else if(deletedId.slice(0,3) === "img"){
        let imageDbTransaction = db.transaction("image" , "readwrite");
        let imageObjectStore = imageDbTransaction.objectStore("image");
        imageObjectStore.delete(deletedId);
    }
}



