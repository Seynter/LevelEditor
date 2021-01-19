var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class Cube {
  constructor(x, y, z, color, width, height, isDragging, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;//цвет
    this.width = width;//ширина
    this.height = height;//высота
    this.isDragging = isDragging;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  //рисует фигуры
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.closePath();
    ctx.fill();
  }
};


//список фигур
let cubes = {
  cube: new Cube(300, 300, 0 , '#00cc66', 50, 70, false, 0.5, 1),
  cubew: new Cube(800, 800, 1 , '#cc0066', 120, 80, false, -3, 1.75),
  cubes: new Cube(1300, 1300, 2 , '#6666ff', 90, 90, false, 1, 2.5),
  cubeo: new Cube(1800, 1800, 3, '#cc00cc', 70, 180, false, 2, 1.5),
  erase: function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}


function draw(){
  cubes.erase()
  if (dragElem){
    grid(dragElem.width, dragElem.height)
  }
  for (name in cubes){
    if (status == true){
      //перемещение по X
      cubes[name].x += cubes[name].speedX;
      if (cubes[name].x > canvas.width - cubes[name].width){
        cubes[name].speedX = -cubes[name].speedX
      }
      if (cubes[name].x < 0){
        cubes[name].speedX = Math.sqrt(Math.pow(cubes[name].speedX, 2));
      }
      //перемещение по Y
      cubes[name].y += cubes[name].speedY;
      if (cubes[name].y > canvas.height - cubes[name].height){
        cubes[name].speedY = - cubes[name].speedY
      }
      if (cubes[name].y < 0){
        cubes[name].speedY = Math.sqrt(Math.pow(cubes[name].speedY, 2));
      }
    }
    if (Cube.prototype.isPrototypeOf(cubes[name])){
      cubes[name].draw();
    }
  }
  requestAnimationFrame(draw)
}

draw()


//набор нужных переменных
var dragElem = false;
var startx, starty, isAltPressed = isShiftPressed = false;
var bounds = canvas.getBoundingClientRect();


function grid(width, height){
  if (isShiftPressed){//если нажат shift
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    for (let i = 1; i <  canvas.width / width; i++){
      ctx.stroke(new Path2D(`M0 ${width * i} h ${canvas.width}`));
    }
    for (let i = 1; i < canvas.height / height; i++){
      ctx.stroke(new Path2D(`M${height * i} 0  v ${canvas.height}`));
    }
  }
}




//движение мышкой
canvas.addEventListener('mousemove', function(event){
  if (dragElem && status == false){
    var mx = event.offsetX * (canvas.width / bounds.width);
    var my = event.offsetY * (canvas.height / bounds.height);

    dragElem.x = mx - startx;
    dragElem.y = my - starty;
    if (isShiftPressed){
      dragElem.x = Math.round((dragElem.x) / canvas.width * dragElem.width) * canvas.width / dragElem.width;
      dragElem.y = Math.round((dragElem.y) / canvas.height * dragElem.height) * canvas.height / dragElem.height;
      console.log("---------------");
      console.log(canvas.width / dragElem.width, dragElem.x);
      console.log(canvas.height / dragElem.height, dragElem.y);
      console.log("---------------");
    }
  }
});


canvas.addEventListener('wheel', function(event){
  if (isAltPressed){
    dragElem.width -= 1;
    dragElem.height -= 1;
  }else{
    dragElem.width += 1;
    dragElem.height += 1;
  }
});

//отпускание клавиши мышки
canvas.addEventListener('mouseup', function(event){
  dragElem = false;
  for (name in cubes){
    cubes[name].isDragging = false;
  }
});

//отслеживание нажатия shift`a
document.addEventListener('keydown', function(event){
  if (event.code === 'ShiftLeft'){
    isShiftPressed = true;
  }
  if (event.code === 'AltLeft'){
    isAltPressed = true;
  }
});

//отслеживание отжатия shift`a
document.addEventListener('keyup', function(event){
  if (event.code === 'ShiftLeft'){
    isShiftPressed = false;
  }
  if (event.code === 'AltLeft'){
    isAltPressed = false;
  }
});

//нажатие клавиши мышки
canvas.addEventListener('mousedown', function(event){
  if (status == false){
    var group = [];
    var mx = event.offsetX * (canvas.width / bounds.width);
    var my = event.offsetY * (canvas.height / bounds.height);

    for (name in cubes){
      if (mx > cubes[name].x && mx < cubes[name].x + cubes[name].width && my > cubes[name].y && my < cubes[name].y + cubes[name].height){
        dragElem = cubes[name];
        startx = mx - dragElem.x;
        starty = my - dragElem.y;
        group.push(cubes[name]);

      }
    };

    if (group.length === 1){
      group[0].isDragging = true;
    }
    else if (group.length >= 2){
      var maxZ = group[0].z;
      var b = group[0];

      for (var i = 1; i < group.length; i++){
        if (maxZ < group[i].z){
          maxZ = group[i].z;
          b = group[i];
        }
      }
      b.isDragging = true;
    }
  }
});



var status = 1;
//Старт
var start = document.getElementById("start");
start.onclick = function() {
  status = 1;
};

//Пауза
var pause = document.getElementById("pause");
pause.onclick = function() {
  status = 0;
};
/*
//Сохранение
var data = 1;
var fileName = 'myData.json';

// Create a blob of the data
var fileToSave = new Blob([JSON.stringify(data)], {
    type: 'application/json',
    name: fileName
});

var x = document.getElementById("save");
x.onclick = function() {
  saveAs(fileToSave, fileName);
};*/
