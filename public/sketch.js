let p;
let blobs = []; // other players
let w = 10;
let grid;
let cols = 80
let rows = 80
let name;

async function setup() {
	name = prompt("What's your name?")
	createCanvas(800, 800);
	p = new Player(0, 0, w);
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name
		})
	}
	const response = await fetch("/grid", options);
	grid = await response.json()
	setInterval(async () => {
		const options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name
			})
		}
		const response = await fetch("/updatePlayer", options);
		blobs = await response.json()
	}, 100)
}

function draw() {
	background(220);
	if (grid) {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (grid[i][j].walls[0]) {
					line(grid[i][j].i * w, grid[i][j].j * w, grid[i][j].i * w + w, grid[i][j].j * w);
				}
				if (grid[i][j].walls[1]) {
					line(grid[i][j].i * w + w, grid[i][j].j * w, grid[i][j].i * w + w, grid[i][j].j * w + w);
				}
				if (grid[i][j].walls[2]) {
					line(grid[i][j].i * w, grid[i][j].j * w + w, grid[i][j].i * w + w, grid[i][j].j * w + w);
				}
				if (grid[i][j].walls[3]) {
					line(grid[i][j].i * w, grid[i][j].j * w + w, grid[i][j].i * w, grid[i][j].j * w);
				}
			}
		}
	}

	for (var i = blobs.length - 1; i >= 0; i--) {
		if (blobs[i].name != name) {
			fill(255, 0, 0);
			ellipse(blobs[i].x * w + w / 2, blobs[i].y * w + w / 2, w, w);
		}
	}
	p.show();
}


async function keyPressed() {
	switch (keyCode) {
		case UP_ARROW:
			if (!grid[p.pos.x][p.pos.y].walls[0]) {
				p.pos.y -= 1;
			}
			break;
		case RIGHT_ARROW:
			if (!grid[p.pos.x][p.pos.y].walls[1]) {
				p.pos.x += 1;
			}
			break;
		case DOWN_ARROW:
			if (!grid[p.pos.x][p.pos.y].walls[2]) {
				p.pos.y += 1
			}
			break;
		case LEFT_ARROW:
			if (!grid[p.pos.x][p.pos.y].walls[3]) {
				p.pos.x -= 1
			}
			break;
	}
	let data = {
		x: p.pos.x,
		y: p.pos.y,
	}
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			pos: data
		})
	}
	await fetch("/move", options);
}

function Cell(i, j) {
	//this.walls = [true, true, true, true];
	this.j = j;
	this.i = i;
	//this.visited = false

	// this.checkN = function () {
	// 	let n = [];
	// 	if (this.i + 1 < cols) {
	// 		if (!grid[this.i + 1][this.j].visited) {
	// 			n.push(grid[this.i + 1][this.j]);
	// 		}
	// 	}
	// 	if (this.i - 1 >= 0) {
	// 		if (!grid[this.i - 1][this.j].visited) {
	// 			n.push(grid[this.i - 1][this.j]);
	// 		}
	// 	}
	// 	if (this.j + 1 < rows) {
	// 		if (!grid[this.i][this.j + 1].visited) {
	// 			n.push(grid[this.i][this.j + 1]);
	// 		}
	// 	}
	// 	if (this.j - 1 >= 0) {
	// 		if (!grid[this.i][this.j - 1].visited) {
	// 			n.push(grid[this.i][this.j - 1]);
	// 		}
	// 	}
	// 	if (n.length == 0) {
	// 		stack.pop();
	// 		return stack.pop();
	// 	} else {
	// 		let next = random(n);
	// 		if (next.i - this.i == 1) { //vpravo
	// 			this.walls[1] = false; // moje prava
	// 			next.walls[3] = false; // jeho levá
	// 		}
	// 		if (next.i - this.i == -1) { // vlevo
	// 			this.walls[3] = false; // moje levá
	// 			next.walls[1] = false; // jeho pravá
	// 		}
	// 		if (next.j - this.j == 1) { // dolu
	// 			this.walls[2] = false; // moje doln
	// 			next.walls[0] = false; // jeho horní
	// 		}
	// 		if (next.j - this.j == -1) { //nahoru
	// 			this.walls[0] = false; // moje horni
	// 			next.walls[2] = false; // jeho dolni
	// 		}
	// 		return next;
	// 	}
	// }
}