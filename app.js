let blobs = [];
let cols;
let rows;
let stack = [];
let current;
let grid = [];
let w = 35;

class Blob {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

var express = require('express');
var app = express();
app.listen(process.env.PORT || 8080);
app.use(express.static("public"));
app.use(express.json({
  limit: "1mb"
}));

generateMaze();

function generateMaze() {
  let done = false;
  let first = true;
  cols = Math.floor(700 / w);
  rows = Math.floor(700 / w);
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  current = grid[0][0];
  current.visited = true;
  while (!done) {
    if (current.i == 0 && current.j == 0 && current.visited == true && first == false) {
      done = true;
      console.log("DONE")
    }
    first = false;
    for (let o = 0; o < 5; o++) {
      if (stack.length > 1) {
        current = current.checkN();
        current.visited = true;
      }
      stack.push(current);
    }
  }
}

app.post("/grid", (request, response) => {
  console.log("New grid request!")
  console.log("Name is: " + request.body.name);
  blobs.push(new Blob(0, 0, request.body.name));
  response.json(grid);
})

app.post("/move", (request, response) => {
  console.log("New move request!")
  console.log("Name is: " + request.body.name);
  for (let blob in blobs) {
    if (blobs[blob].name == request.body.name) {
      blobs[blob].x = request.body.pos.x;
      blobs[blob].y = request.body.pos.y;
    }
  }
  response.end();
})

app.post("/updatePlayer", (request, response) => {
  response.json(blobs);
})



function Cell(i, j) {
  this.walls = [true, true, true, true];
  this.j = j;
  this.i = i;
  this.visited = false
  this.checkN = function () {
    let n = [];
    if (this.i + 1 < cols) {
      if (!grid[this.i + 1][this.j].visited) {
        n.push(grid[this.i + 1][this.j]);
      }
    }
    if (this.i - 1 >= 0) {
      if (!grid[this.i - 1][this.j].visited) {
        n.push(grid[this.i - 1][this.j]);
      }
    }
    if (this.j + 1 < rows) {
      if (!grid[this.i][this.j + 1].visited) {
        n.push(grid[this.i][this.j + 1]);
      }
    }
    if (this.j - 1 >= 0) {
      if (!grid[this.i][this.j - 1].visited) {
        n.push(grid[this.i][this.j - 1]);
      }
    }
    if (n.length == 0) {
      stack.pop();
      return stack.pop();
    } else {
      let next = n[Math.floor(Math.random() * n.length)];
      if (next.i - this.i == 1) { //vpravo
        this.walls[1] = false; // moje prava
        next.walls[3] = false; // jeho levá
      }
      if (next.i - this.i == -1) { // vlevo
        this.walls[3] = false; // moje levá
        next.walls[1] = false; // jeho pravá
      }
      if (next.j - this.j == 1) { // dolu
        this.walls[2] = false; // moje doln
        next.walls[0] = false; // jeho horní
      }
      if (next.j - this.j == -1) { //nahoru
        this.walls[0] = false; // moje horni
        next.walls[2] = false; // jeho dolni
      }
      return next;
    }
  }
}