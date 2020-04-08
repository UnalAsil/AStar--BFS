"use strict";

// importScripts('A*withQueue.js');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
canvas.id = "CursorLayer";
canvas.onmousedown = canvasOnMouseDown;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";
canvas.style.width = "50%";

var red_channel = null;
var wth = null, hei = null;

var body = document.getElementsByTagName("body")[0];
body.insertBefore(canvas, body.firstChild);
var newImg = new Image;

newImg.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0, this.width, this.height);
    // Guncelle global degeleri ve red channel; -> 44
    startCalc();
    reduceAlpha(125)
}

function changesrc(path) {
    newImg.src = path;
}

changesrc('messi5.jpg')

// let astar_worker = new Worker("A*withQueue.js");

document.getElementById('img').onchange = function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            changesrc(e.target.result)
        }
        reader.readAsDataURL(this.files[0]);
    }
};

function startCalc() {
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let index = getIndex(50, 50, img_data.width, img_data.height) // globalleri kullan

    if (index) {
        console.log("Index : " + index);
        console.log("R: " + img_data.data[index]); //Red chanell
        console.log("G: " + img_data.data[index + 1]); // gree
        console.log("B: " + img_data.data[index + 2]); //blu
        console.log("A: " + img_data.data[index + 3]); // alp
    }
}

function getIndex(i, j, width, height) {
    if (i < height && j < width)
        return (i * width + j) * 4;
    return null;
}

function reduceAlpha(trash_hold) {
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = Math.round(img_data.height / 2); i < img_data.height; i++) {
        for (let j = Math.round(img_data.width / 2); j < img_data.width; j++) {
            img_data.data[getIndex(i, j, img_data.width, img_data.height) + 3] -= trash_hold;
        }
    }
    ctx.putImageData(img_data, 0, 0);
}

let coordStart = null;
let coordEnd = null;
let control = false;

function canvasOnMouseDown(e) {
    e.preventDefault();
    console.log(e);
    let x = e.clientX;
    let y = e.clientY;

    if (!control) {
        coordStart = { x: x, y: y };
    }
    else {
        coordEnd = { x: x, y: y };
        console.log(coordStart, coordEnd);
        console.log("console log trgle cagirdim");
        // trigger_worker();
        let path = Astar();
        console.log("Yol geldi",path)
        trigle(path)
    }
    control = !control;

    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let index = getIndex(y, x, img_data.width, img_data.height)

    if (index) {
        // console.log("Index : " + index);
        // console.log("R: " + img_data.data[index]); //Red chanell
        // console.log("G: " + img_data.data[index+1]); // gree
        // console.log("B: " + img_data.data[index+2]); //blu
        // console.log("A: " + img_data.data[index+3]); // alp
    }

}

function controller(val1, val2, inc){
    if(inc>0)
        return val1<val2;
    return val2<val1;
}

function trigle(path){
    ctx = canvas.getContext("2d");
    console.log("Giris yapiyorum");
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";

    for(let item = 0;item < path.length; item=item+1){
        // console.log(" Yol cizdirmede  x,y", path[item].x, path[item].y)
        ctx.fillRect(path[item].position.x, path[item].position.y, 1, 1);
    }

    // ctx.putImageData(img_data, 0, 0);
    
    // let xInc = (coordEnd.x - coordStart.x  ) / Math.abs(coordEnd.x - coordStart.x   )
    // let yInc = (coordEnd.y - coordStart.y ) / Math.abs(coordStart.y-coordEnd.y  )

    // ctx.fillStyle = "red";

    // for (let i = coordStart.x; controller(i,coordEnd.x,xInc); i+=xInc*5)
    // {
    //     ctx.fillRect(i,coordStart.y,4,4);
    // }

    // for (let j = coordStart.y; controller(j,coordEnd.y,yInc) ; j+=yInc*5)
    // {
    //     ctx.fillRect(coordEnd.x,j,4,4);
    // }
}

function Astar() {
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let start_time = performance.now()
    // console.log("Zaman", start_time)
    // let current_point= new Cell()
    let queue = new Ownqueue()
    let visited = {}
    let start_point = new Cell()
    start_point.setPosition(coordStart)
    // console.log("Position Start", start_point.position)
    let end_point = new Cell()
    end_point.setPosition(coordEnd)
    // console.log("Position end", end_point.position)
    console.log("StartPoint", start_point)

    queue.insert(start_point)
    visited[start_point.position.x+"_"+start_point.position.y] = start_point

    let new_pointX
    let new_pointY
    let temp
    let count = 0
    while (!queue.empty() && count<100000000) {
        let new_points = [] ;
        let current_point = new Cell()
        Object.assign(current_point, queue.pop_min())
        // console.log("Guncel obje",current_point)
        if (current_point.position.x == end_point.position.x && current_point.position.y == end_point.position.y) {
            let path = []
            let current = current_point
            while (current.parent != null) {
                path.push({position:current.position, cost : current.f})
                current = current.parent
            }
            console.log("Path olusturuldu", path)
            return path;
        }
        let x_ = [1,-1, 0, 0, 1, -1];
        let y_ = [0, 0, 1,-1, 1, -1];
        // console.log("Alandayim",current_point)
        for (let item=0; item<6; item++){
            new_pointX = current_point.position.x + x_[item]
            new_pointY = current_point.position.y + y_[item]
            // console.log("new pointx, new_point y ",  new_pointX, new_pointY)
            if(!(new_pointX < 0 || new_pointX >=canvas.width  || new_pointY < 0 || new_pointY >= canvas.height) && !visited[new_pointX+"_"+new_pointY]){
                temp = new Cell()
                temp.setParent(current_point)
                temp.setPosition({x:new_pointX,y:new_pointY})
                // temp.g = current_point.g + img_data.data[getIndex(temp.position.x, temp.position.y, img_data.width, img_data.height)]
                temp.g = current_point.g
                temp.h = ((temp.position.x - end_point.position.x) ** 2) + ((temp.position.y - end_point.position.y) ** 2)
                temp.f = temp.g + temp.h
                // console.log("Basiyorum su anda", temp)
                visited[new_pointX+"_"+new_pointY] = temp
                queue.insert(temp)
            }
        }
        count++;
        }
        // console.log("Path olusmadi");
    }

function is_visited(new_point, visited){

    return visited[new_point.position.x+"_"+new_point.position.y]
}
    

class Cell {
    constructor(parent = null, position = null) {
        // self.parent = parent
        // self.position = position
        this.g = 0
        this.h = 0
        this.f = 0
    }
    setParent(parent) {
        this.parent = parent
    }
    setPosition(position) {
        this.position = position
    }
}

class Ownqueue {
    constructor() {
        this.queue = [];
    }
    pop_min() {
       let current_point = this.queue[0]
       let curent_index = 0
        // console.log("Queue size", this.queue.length)
        for (let item=0 ; item<this.queue.length;item++){
            if(this.queue[item].f<current_point.f){
                current_point = this.queue[item]
                curent_index = item;
            }
        }
        this.queue.splice(curent_index, 1);
        return current_point
        // let min = this.queue[0].f;
        // let idx = 0;
        // let i = this.queue.length;
        // while (--i) {
        //     if (this.queue[i].f < min) {
        //         min = this.queue[i].cost;
        //         idx = i;
        //     }
        // }
        // let val = this.queue[idx];
        // this.queue.splice(idx, 1);
        // return val;
    }

    insert(item) {
        console.log("Bastim kuyruga")
        this.queue.push(item);
    }
    empty() {
        return this.queue.length == 0;
    }
    clear() {
        this.queue = [];
    }
    size(){
        return this.queue.size;
    }
}