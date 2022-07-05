const MIME_TYPE = "image/png";
const QUALITY = 0.7;

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

// Utility functions for demo purpose

// function displayInfo(label, w, h, showInfo, canvasID) {
//   const p = document.createElement('p');
//   p.innerText = `${label} - Width: ${w} Height: ${h}`;
//   const button = document.createElement('button');
//   button.setAttribute('onclick',`download("${canvasID}")`);
//   button.className = "downloadbtn";
//   const a = document.createElement('a');
//   a.className = canvasID;
//   a.innerText = `Download`;
//   button.appendChild(a);
//   if(showInfo == "withDownload"){
//     p.appendChild(button)
//   }
//   document.getElementsByClassName('eachImg-compressed').append(p);
// }

function changeHtmlElementId (canvasID)
  {
     var htmlElement = document.getElementById(canvasID);
     htmlElement.id = "myCanvasOld";  // here you can assign new Id
     var Tag = document.getElementsByClassName(canvasID)
     Tag[0].className = "downloadOld";
  }

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}



$(document).ready(function(){
  $("#nodeStatus").click(function(){
    if($("#nodeStatus").text() == "Hide Node Status"){
      $("#right").hide();
      $("#nodeStatus").text("Show Node Status");
    }
    else{
      $("#right").show();
      $("#nodeStatus").text("Hide Node Status");
    }
  });
});

function handleDragOver(evt) {
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
} // handleDragOver

function handleFileSelect(evt) {
  evt.stopPropagation(); // Do not allow the drop event to bubble.
  evt.preventDefault(); // Prevent default drop event behavior.

  if (evt.dataTransfer != null){
    var files = evt.dataTransfer.files; // Grab the list of files dragged to the drop box.
  } else {
    var files = evt.target.files; // FileList object from input
  }

  if (!files) {
      alert("<p>At least one selected file is invalid - do not select any folders.</p><p>Please reselect and try again.</p>");
      return;
  }
  for (var i = 0; i < files.length; i++) {
      if (!files[i]) {
          alert("Unable to access " + file.name);
          continue; // Immediately move to the next file object.
      }
      if (files[i].size == 0) {
          alert("Skipping " + files[i].name.toUpperCase() + " because it is empty.");
          continue;
      }
      if (files_checksum.includes(fileChecksum(files[i]))) {
          alert("This files is already listed");
          continue
      } else {
          files_checksum[filesOk.length] = fileChecksum(files[i])
          document.querySelector("#compressWorkBox").querySelector("ul").innerHTML += '<li id="' + fileChecksum(files[i]) + '"><strong class="fileName">' +
          files[i].name + '</strong> <spam class="itemClose"><a class="removeItem" href="#" onclick="removeItem(\''+fileChecksum(files[i])+'\')">&times;</a></spam>' +
          '</a></spam><br> <spam id="fileProperties"> (' + (files[i].type || 'n/a' ) +') - ' +
          files[i].size + ' bytes, last modified: ' + new Date(files[i].lastModified).toLocaleDateString() +'</spam></li>';

          filesOk[filesOk.length] = files[i]; //push valid files for filesOk array
      }
  }

}

document.getElementById('dropContainer').addEventListener('dragover', handleDragOver, false);
document.getElementById('dropContainer').addEventListener('drop', handleFileSelect, false);
document.getElementById('img-browse').addEventListener('change', handleFileSelect, false);

function download(canvasID) {
  var Tag = document.getElementsByClassName(canvasID);
  var imageLink = document.getElementById(canvasID).toDataURL("image/png").replace("image/png", "image/octet-stream");
  Tag[0].download = canvasID;
  Tag[0].setAttribute("href", imageLink);
  changeHtmlElementId(canvasID);
}

function compress() {
  var sidemenu = document.getElementById('imgList');
  while (sidemenu.children.length > 0) {
      sidemenu.removeChild(sidemenu.lastChild);
  }

  const MAX_WIDTH = document.getElementById("widthSize").value;
  const MAX_HEIGHT = document.getElementById("heightSize").value;

  for(let i = 0; i < filesOk.length; i ++) {
    const file = filesOk[i]; // get the file
    const blobURL = URL.createObjectURL(file);
    console.log(blobURL)
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
      console.log("Cannot load image");
    };
    
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      console.log(img.width)
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.id = file.name;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const div = document.createElement('div');
      div.className = "eachImg-compressed";
      div.appendChild(canvas);

      const p = document.createElement('p');
      p.innerText = `Original file size: - Width: ${img.width} Height: ${img.height}`;
      div.append(p);

      const p1 = document.createElement('p');
      p1.innerText = `Original file size: - Width: ${newWidth} Height: ${newHeight}`;

      const button = document.createElement('button');
      button.setAttribute('onclick',`download("${canvas.id}")`);
      button.className = "downloadbtn";
      const a = document.createElement('a');
      a.className = canvas.id;
      a.innerText = `Download`;
      button.appendChild(a);
      p1.appendChild(button)

      div.append(p1);
      document.getElementById("resultShow").append(div);
    };
  }

  
  
  //reset filesList input
  document.getElementById("img-browse").value = ''
  if(!/safari/i.test(navigator.userAgent)){
    document.getElementById("img-browse").type = ''
    document.getElementById("img-browse").type = 'file'
  }
  filesOk = [];
  files_checksum = [];
};

function reset () {
  var sidemenu = document.getElementById('imgList');
  while (sidemenu.children.length > 0) {
      sidemenu.removeChild(sidemenu.lastChild);
  }
  var resultmenu = document.getElementById('resultShow');
  while (resultmenu.children.length > 0) {
    resultmenu.removeChild(resultmenu.lastChild);
  }
  //reset filesList input
  document.getElementById("img-browse").value = ''
  if(!/safari/i.test(navigator.userAgent)){
    document.getElementById("img-browse").type = ''
    document.getElementById("img-browse").type = 'file'
  }
  filesOk = [];
  files_checksum = [];
}

