const MIME_TYPE = "image/jpeg/png";
const QUALITY = 0.7;

const input = document.getElementById("img-input");
input.onchange = function (ev) {
  const MAX_WIDTH = document.getElementById("widthSize").value;
  const MAX_HEIGHT = document.getElementById("heightSize").value;
  const file = ev.target.files[0]; // get the file
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
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    canvas.toBlob(
      (blob) => {
        // Handle the compressed image. es. upload or save in local state
        displayInfo('Original file', file);
        displayInfo('Compressed file', blob);
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

function displayInfo(label, file) {
  const p = document.createElement('p');
  p.innerText = `${label} - ${readableBytes(file.size)}`;
  document.getElementById('imageUploadforReduce').append(p);
}

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}