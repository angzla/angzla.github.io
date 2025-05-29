// ------------------ Flower ------------------

class Flower {
    constructor(r, g, b, px, py, s, dx, dy, sizeFactor = 0.6) {
    this.red = r;
    this.green = g;
    this.blue = b;
    this.posx = px;
    this.posy = py;
    this.speed = s;
    this.directionx = dx;
    this.directiony = dy;
    this.sizeFactor = sizeFactor;
    this.localScale = 0;
    }
      
    update() {
    push();
    translate(this.posx, this.posy);

    fill(this.red, this.green, this.blue, 127);
    noStroke();

    for (let i = 0; i < 10; i++) {
      ellipse(0, 30, 20 * this.sizeFactor, this.localScale += 0.2);
      if (this.localScale >= 20 * this.sizeFactor) {
        this.localScale = 0;
      }
      rotate(PI / 5);
    }

    pop();
  }
}

// ------------------ Lily Pad ------------------

class LilyPad {
  constructor(x, y, label, link, size = 100) {
    this.pos = createVector(x, y);
    this.size = size;
    this.label = label;
    this.link = link;

    // Ripple effect variables
    this.reflectionRing = 0;
    this.reflectionRing2 = this.size * 0.7;
    this.strokeValue = 40;
    this.strokeValue2 = 40;
  }

  contains(mx, my) {
    return dist(mx, my, this.pos.x, this.pos.y + this.size / 4) < this.size / 2;
  }

  ripple() {
    noFill();
    if (this.reflectionRing < this.size * 2) {
      stroke(100, this.strokeValue);
      circle(this.pos.x, this.pos.y + this.size / 2, this.reflectionRing);
      this.reflectionRing += 1;
      this.strokeValue -= 40 / (this.size * 2);
    } else {
      this.reflectionRing = 0;
      this.strokeValue = 40;
    }

    if (this.reflectionRing2 < this.size * 2) {
      stroke(100, this.strokeValue2);
      circle(this.pos.x, this.pos.y + this.size / 2, this.reflectionRing2);
      this.reflectionRing2 += 1;
      this.strokeValue2 -= 40 / (this.size * 2);
    } else {
      this.reflectionRing2 = this.size * 0.7; // reset with offset
      this.strokeValue2 = 40;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(30, 150, 80, 150);

    noStroke();
    fill(14, 184, 12, 220);

    // Draw arc shape like your original
    let startAngle = PI / 4;
    let endAngle = PI / 10;
    arc(0, this.size / 2, this.size, this.size, startAngle, endAngle, PIE);

    drawingContext.shadowBlur = 0;

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.size / 10);
    text(this.label, 0, this.size * 0.9);
    pop();
  }
}