var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
canvas.id = "CursorLayer";
// canvas.width = 5000;
// canvas.height = 5000;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";
canvas.style.width = "50%";

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var newImg = new Image;
newImg.onload = function() {
    console.log(this)
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0, this.width, this.height);
}

newImg.src = 'messi5.jpg';