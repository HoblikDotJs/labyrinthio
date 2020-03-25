class Player {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    stroke(0);
    fill(0);
    ellipse(this.pos.x * this.r + this.r / 2, this.pos.y * this.r + this.r / 2, this.r, this.r);
  }
}