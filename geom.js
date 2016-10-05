function consLine(ax, ay, bx, by, p5) {
  var ln = new Line();
  ln.ax = ax;
  ln.ay = ay;
  ln.bx = bx;
  ln.by = by;
  ln.sw = p5.random(7, 10);
  return ln;
}

function Line() {
  this.display = function(p5) {
    p5.strokeWeight(this.sw);
    p5.strokeCap(p5.SQUARE);
    p5.line(this.ax, this.ay, this.bx, this.by);
  }
}

function consRect(x1, y1, x2, y2) {
  var r = new Rect();
  r.x1 = x1;
  r.y1 = y1;
  r.x2 = x2;
  r.y2 = y2;
  return r;
}

function Rect() {
  this.display = function(p5) {
    p5.rectMode(p5.CORNERS);
    p5.rect(this.x1, this.y1, this.x2, this.y2);
  }

  this.getArea = function() {
    return this.getWidth() * this.getHeight();
  }

  this.getWidth = function() {
    return this.x2 - this.x1;
  }

  this.getHeight = function() {
    return this.y2 - this.y1;
  }
}

function consColoredRect(rect, col) {
  var r = new ColoredRect();
  r.rect = rect;
  r.col = col;
  return r;
}

function ColoredRect() {
  this.display = function(p5) {
    p5.noStroke();
    p5.fill(this.col);
    this.rect.display(p5);
  }
}
