const MIME_TYPE = "image/png";
const QUALITY = 0.7;
var DownloadFileName;

const input = document.getElementById("img-input");
input.onchange = function (ev) {
  const MAX_WIDTH = document.getElementById("widthSize").value;
  const MAX_HEIGHT = document.getElementById("heightSize").value;
  const file = ev.target.files[0]; // get the file
  DownloadFileName = file.name;
  const blobURL = URL.createObjectURL(file);
  const img = new Image();
  img.src = blobURL;
  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    // Handle the failure properly
    console.log("Cannot load image");
  };
  img.onload = function () {
    URL.revokeObjectURL(this.src);
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.id = "myCanvas";
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    canvas.toBlob(
      (blob) => {
        // Handle the compressed image. es. upload or save in local state
        displayInfo('Original file size:', img.width, img.height, "onlyInfo");
        displayInfo('Compressed file size', newWidth, newHeight, "withDownload");
      },
      MIME_TYPE,
      QUALITY
    );
    document.getElementById("imageUploadforReduce").append(canvas);
  };
};

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

function displayInfo(label, w, h, showInfo) {
  const p = document.createElement('p');
  p.innerText = `${label} - Width: ${w} Height: ${h}`;
  const button = document.createElement('button');
  button.setAttribute('onclick','download(this)');
  button.className = "downloadbtn";
  const a = document.createElement('a');
  a.className="download";
  a.innerText = `Download`;
  button.appendChild(a);
  if(showInfo == "withDownload"){
    p.appendChild(button)
  }
  document.getElementById('imageUploadforReduce').append(p);
}

function changeHtmlElementId ()
  {
     var htmlElement = document.getElementById("myCanvas");
     htmlElement.id = "myCanvasOld";  // here you can assign new Id
     var Tag = document.getElementsByClassName("download");
     Tag[0].className = "downloadOld";
  }

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function download() {
  var Tag = document.getElementsByClassName("download");
  var imageLink = document.getElementById("myCanvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
  Tag[0].download = DownloadFileName;
  Tag[0].setAttribute("href", imageLink);
  changeHtmlElementId();
  }