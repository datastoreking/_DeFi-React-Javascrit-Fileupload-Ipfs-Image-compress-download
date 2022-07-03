const MIME_TYPE = "image/png";
const QUALITY = 0.7;

const input = document.getElementById("img-input");
input.onchange = function (ev) {
  const MAX_WIDTH = document.getElementById("widthSize").value;
  const MAX_HEIGHT = document.getElementById("heightSize").value;
  const file = ev.target.files[0]; // get the file
  console.log(file)
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
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.id = "myCanvas";
    console.log(canvas.width, canvas.height, canvas.id)
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    console.log(img.width)
    canvas.toBlob(
      (blob) => {
        // Handle the compressed image. es. upload or save in local state
        displayInfo('Original file size:', img.width, img.height);
        displayInfo('Compressed file size', newWidth, newHeight);
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

function displayInfo(label, w, h) {
  const p = document.createElement('p');
  p.innerText = `${label} - Width: ${w} Height: ${h}`;
  document.getElementById('imageUploadforReduce').append(p);
}

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function download() {
  var download = document.getElementById("download");
  download.download = "download.png"
  var image = document.getElementById("myCanvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
  console.log(download)
  }