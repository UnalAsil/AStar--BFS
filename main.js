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
    let coeff = (canvas.width / canvas.offsetWidth);
    let x = Math.floor(coeff*e.pageX);
    let y = Math.floor(coeff*e.pageY)
    
    if (!control) {
        coordStart = { x: x, y: y };
    }
    else {
        coordEnd = { x: x, y: y };
        console.log(coordStart, coordEnd);
        console.log("console log trgle cagirdim");
        // trigger_worker();
        let type = "1"
        let type1 = ("1")
        let path0, time0, count0, maks0
        // ({path0,time0,count0,maks0})
        var element = document.getElementsByTagName("table"), index1;

        for (index1 = element.length - 1; index1 >= 0; index1--) {
            element[index1].parentNode.removeChild(element[index1]);
        }
    
        let a = Astar("queue");
        tableCreate(a,"A* with Queue");
        trigle(a[0],"red")
        let b = Astar("heap");
        tableCreate(b, "A* with Heap");
        trigle(b[0],"blue")
        let c = BFS("queue");
        trigle(c[0],"black")
        tableCreate(c,"BFS with Queue");
        let d = BFS("heap");
        trigle(d[0],"yellow")
        tableCreate(d,"BFS with Heap");
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

function controller(val1, val2, inc) {
    if (inc > 0)
        return val1 < val2;
    return val2 < val1;
}

function trigle(path,color) {
    ctx = canvas.getContext("2d");
    console.log("Giris yapiyorum");
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;

    for (let item = 0; item < path.length; item = item + 6) {
        // console.log(" Yol cizdirmede  x,y", path[item].x, path[item].y)
        ctx.fillRect(path[item].position.x, path[item].position.y, 5, 5);
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

function Astar(type) {
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let start_time = performance.now()
    ctx.fillStyle = "blue";

    let queue = null
    if (type == "queue") {
        queue = new Ownqueue()
    }
    else {
        queue = new MinHeap()
    }
    // let queue = new MinHeap()
    // let queue = new Ownqueue()
    let visited = {}
    let start_point = new Cell()
    start_point.setPosition(coordStart)
    // console.log("Position Start", start_point.position)
    let end_point = new Cell()
    end_point.setPosition(coordEnd)
    // console.log("Position end", end_point.position)
    console.log("StartPoint", start_point)

    queue.insert(start_point)
    visited[start_point.position.x + "_" + start_point.position.y] = start_point

    let new_pointX
    let new_pointY
    let temp
    let count = 0
    let maks = 0
    while (!queue.empty()) {
        let current_point = new Cell()
        Object.assign(current_point, queue.pop_min())
        count++
        // console.log("Guncel obje",current_point)
        if (current_point.position.x == end_point.position.x && current_point.position.y == end_point.position.y) {
            let path = []
            let current = current_point
            while (current.parent != null) {
                path.push({ position: current.position, cost: current.f })
                current = current.parent
            }
            let end_time = performance.now();
            console.log("Path olusturuldu", path)
            return [path, end_time - start_time, count, maks];
            // return path
        }
        let x_ = [1, -1, 0, 0, 1, -1];
        let y_ = [0, 0, 1, -1, 1, -1];
        // console.log("Alandayim",current_point)
        for (let item = 0; item < 4; item++) {
            new_pointX = current_point.position.x + x_[item]
            new_pointY = current_point.position.y + y_[item]
            // console.log("new pointx, new_point y ",  new_pointX, new_pointY)
            if (!(new_pointX < 0 || new_pointX >= canvas.width || new_pointY < 0 || new_pointY >= canvas.height) && !visited[new_pointX + "_" + new_pointY]) {
                temp = new Cell()
                temp.setParent(current_point)
                temp.setPosition({ x: new_pointX, y: new_pointY })
                let reelcost = img_data.data[getIndex(temp.position.y, temp.position.x, img_data.width, img_data.height)]
                reelcost = 255 - reelcost
                if (reelcost == 0) {
                    reelcost = 1
                }
                temp.g = current_point.g + reelcost
                // temp.g = current_point.g
                temp.h = Math.sqrt(((temp.position.x - end_point.position.x) ** 2) + ((temp.position.y - end_point.position.y) ** 2))
                temp.f = temp.g + temp.h
                // console.log("Basiyorum su anda", temp)
                visited[new_pointX + "_" + new_pointY] = temp
                queue.insert(temp)
                // ctx.fillRect(new_pointX,new_pointY, 1, 1)
                if (queue.size() > maks) {
                    maks = queue.size();
                }
            }
        }
    }
    // console.log("Path olusmadi");
}


function BFS(type) {
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let start_time = performance.now()
    ctx.fillStyle = "blue";

    let queue = null
    if (type == "queue") {
        queue = new Ownqueue()
    }
    else {
        queue = new MinHeap()
    }
    // let queue = new MinHeap()
    // let queue = new Ownqueue()
    let visited = {}
    let start_point = new Cell()
    start_point.setPosition(coordStart)
    // console.log("Position Start", start_point.position)
    let end_point = new Cell()
    end_point.setPosition(coordEnd)
    // console.log("Position end", end_point.position)
    console.log("StartPoint", start_point)

    queue.insert(start_point)
    visited[start_point.position.x + "_" + start_point.position.y] = start_point

    let new_pointX
    let new_pointY
    let temp
    let count = 0
    let maks = 0
    while (!queue.empty()) {
        let current_point = new Cell()
        Object.assign(current_point, queue.pop_min())
        count++
        // console.log("Guncel obje",current_point)
        if (current_point.position.x == end_point.position.x && current_point.position.y == end_point.position.y) {
            let path = []
            let current = current_point
            while (current.parent != null) {
                path.push({ position: current.position, cost: current.f })
                current = current.parent
            }
            let end_time = performance.now();
            console.log("Path olusturuldu", path)
            return [path, end_time - start_time, count, maks];
            // return path
        }
        let x_ = [1, -1, 0, 0, 1, -1];
        let y_ = [0, 0, 1, -1, 1, -1];
        // console.log("Alandayim",current_point)
        for (let item = 0; item < 4; item++) {
            new_pointX = current_point.position.x + x_[item]
            new_pointY = current_point.position.y + y_[item]
            // console.log("new pointx, new_point y ",  new_pointX, new_pointY)
            if (!(new_pointX < 0 || new_pointX >= canvas.width || new_pointY < 0 || new_pointY >= canvas.height) && !visited[new_pointX + "_" + new_pointY]) {
                temp = new Cell()
                temp.setParent(current_point)
                temp.setPosition({ x: new_pointX, y: new_pointY })
                let reelcost = img_data.data[getIndex(temp.position.y, temp.position.x, img_data.width, img_data.height)]
                reelcost = 255 - reelcost
                if (reelcost == 0) {
                    reelcost = 1
                }
                // temp.g = current_point.g + reelcost
                temp.g = current_point.g
                temp.h = Math.sqrt(((temp.position.x - end_point.position.x) ** 2) + ((temp.position.y - end_point.position.y) ** 2))
                temp.f = temp.g + temp.h
                // console.log("Basiyorum su anda", temp)
                visited[new_pointX + "_" + new_pointY] = temp
                queue.insert(temp)
                // ctx.fillRect(new_pointX,new_pointY, 1, 1)
                if (queue.size() > maks) {
                    maks = queue.size();
                }
            }
        }
    }
    // console.log("Path olusmadi");
}


function is_visited(new_point, visited) {

    return visited[new_point.position.x + "_" + new_point.position.y]
}


class Cell {
    constructor(parent = null, position = null) {
        // self.parent = parent
        // self.position = position
        this.g = 0
        this.h = 0
        this.f = 0
        this.parent = null
        this.position = null
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
        for (let item = 0; item < this.queue.length; item++) {
            if (this.queue[item].f < current_point.f) {
                current_point = this.queue[item]
                curent_index = item;
            }
        }
        this.queue.splice(curent_index, 1);
        return current_point
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
    size() {
        return this.queue.length;
    }
}

class MinHeap {
    constructor() {
        this.heapList = [0]
        this.currentSize = 0
    }

    size() { return this.currentSize }

    percUp(i) {
        while (Math.floor(i / 2) > 0) {
            if (this.heapList[i].f < this.heapList[Math.floor(i / 2)].f) {
                let tmp = this.heapList[Math.floor(i / 2)]
                this.heapList[Math.floor(i / 2)] = this.heapList[i]
                this.heapList[i] = tmp
            }
            i = Math.floor(i / 2)
        }
    }

    insert(k) {
        this.heapList.push(k)
        this.currentSize = this.currentSize + 1
        this.percUp(this.currentSize)
    }
    empty() {
        return this.curent_Size == 0;
    }
    percDown(i) {
        while ((i * 2) <= this.currentSize) {
            let mc = this.minChild(i)
            if (this.heapList[i].f > this.heapList[mc].f) {
                let tmp = this.heapList[i]
                this.heapList[i] = this.heapList[mc]
                this.heapList[mc] = tmp
            }
            i = mc
        }
    }

    minChild(i) {
        if (i * 2 + 1 > this.currentSize)
            return i * 2
        else {
            if (this.heapList[i * 2].f < this.heapList[i * 2 + 1].f)
                return i * 2
            else
                return i * 2 + 1
        }
    }

    pop_min() {
        let retval = this.heapList[1]
        this.heapList[1] = this.heapList[this.currentSize]
        this.currentSize = this.currentSize - 1
        this.heapList.pop()
        this.percDown(1)
        return retval
    }
}

function tableCreate(results,name) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.style.width = '30%';
    tbl.style.marginRight = '30px';
    tbl.style.marginLeft = 'auto';
    tbl.style.marginTop = '10px';
    tbl.setAttribute('border', '1');
    var temp = ["Zaman: ", "Stack cekilen eleman: ", " maksimum eleman sayisi: "]
    var tbdy = document.createElement('tbody');
    var tr2 = document.createElement('tr');
    
        var td2 = document.createElement('td');
        td2.appendChild(document.createTextNode(name))
        tr2.appendChild(td2)
        tbdy.appendChild(tr2);
    for (var i = 1; i < 4; i++) {
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(temp[i - 1]))
        tr.appendChild(td)

        var td1 = document.createElement('td');
        td1.appendChild(document.createTextNode(results[i]))
        tr.appendChild(td1)

        tbdy.appendChild(tr);
      
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}
