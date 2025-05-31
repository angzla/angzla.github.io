// ------------------ Koi Fish ------------------

class KoiFish {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D().mult(1.5);
      this.acc = createVector();
      this.size = random(20, 40);
      this.maxSpeed = 2;
      this.noiseOffset = random(1000);
      this.target = null;
      this.finWiggle = random(1000);
      this.tailWiggle = random(1000);
      this.trailIndex = 0;
  
      this.bodyColor = random([
        color(255, 100, 100),
        color(255, 255, 255),
        color(255, 150, 0),
        color(255, 200, 50)
      ]);
  
      this.spots = [];
      let numSpots = floor(random(2, 5));
      for (let i = 0; i < numSpots; i++) {
        this.spots.push({
          x: random(-0.5, 0.5),
          y: random(-0.4, 0.4),
          w: random(0.2, 0.4),
          h: random(0.1, 0.3),
          c: color(random(150, 255), random(0, 100), random(0, 50), 200)
        });
      }
    }
  
    attractTo(targetVec) {
      this.target = targetVec.copy();
    }

    followTrail(trail) {
      if (trail.length === 0) {
        this.target = null;
        return;
      }
      // Clamp trailIndex to valid range
      this.trailIndex = constrain(this.trailIndex, 0, trail.length - 1);
      let targetStar = trail[this.trailIndex].pos;
      this.target = targetStar.copy();
    
      // If close enough to current target star, move to next star
      if (p5.Vector.dist(this.pos, targetStar) < 10) {
        this.trailIndex++;
        if (this.trailIndex >= trail.length) {
          this.trailIndex = trail.length - 1; // or 0 if you want loop
        }
      }
    }
    
  
    update() {
      let wanderAngle = noise(this.noiseOffset + frameCount * 0.01) * TWO_PI * 2;
      let wander = p5.Vector.fromAngle(wanderAngle).mult(0.2);
  
      if (this.target) {
        let desired = p5.Vector.sub(this.target, this.pos);
        if (desired.mag() < 10) this.target = null;
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.vel).limit(0.1);
        this.acc.add(steer);
      } else {
        this.acc.add(wander);
      }
  
      this.vel.add(this.acc).limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
  
      // Keep koi in bounds
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);
    }
    display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
  
    let tailAngle = sin(this.tailWiggle + frameCount * 0.1) * PI / 8;
    let finAngle = sin(this.finWiggle + frameCount * 0.2) * PI / 16;
  
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = this.bodyColor;
    noStroke();
  
    // Body
    fill(this.bodyColor);
    ellipse(0, 0, this.size * 2.4, this.size);
      
    // Tail - forked with two prongs
  push();
  translate(-this.size * 1, 0);
  rotate(tailAngle);
  fill(this.bodyColor);
  beginShape();
    // Left prong
    curveVertex(0, 0);
    curveVertex(-this.size * 0.6, -this.size * 0.4);
    curveVertex(-this.size * 0.8, -this.size * 0.2);
    curveVertex(-this.size * 0.5, 0);
    // Right prong
    curveVertex(-this.size * 0.8, this.size * 0.2);
    curveVertex(-this.size * 0.6, this.size * 0.4);
    curveVertex(0, 0);
  endShape(CLOSE);
  pop();
  
  // Fins - small V shapes mimicking tail forks
  fill(this.bodyColor);
  
  // Top fin
  push();
  translate(-this.size * 0.1, -this.size * 0.5);
  rotate(finAngle);
  beginShape();
    curveVertex(0, 0);
    curveVertex(-this.size * 0.3, -this.size * 0.2);
    curveVertex(-this.size * 0.5, 0);
    curveVertex(-this.size * 0.3, this.size * 0.2);
  endShape(CLOSE);
  pop();
  
  // Bottom fin
  push();
  translate(-this.size * 0.1, this.size * 0.5);
  rotate(-finAngle);
  beginShape();
    curveVertex(0, 0);
    curveVertex(-this.size * 0.3, -this.size * 0.2);
    curveVertex(-this.size * 0.5, 0);
    curveVertex(-this.size * 0.3, this.size * 0.2);
  endShape(CLOSE);
  pop();
  
  
    // Spots
    for (let s of this.spots) {
      fill(s.c);
      ellipse(this.size * s.x, this.size * s.y, this.size * s.w, this.size * s.h);
    }
  
    // Eye
    fill(0);
    ellipse(this.size * 0.8, -this.size * 0.15, this.size * 0.1, this.size * 0.1);
  
    pop();
  }
   }


// ------------------ RIPPLE ------------------

class Ripple {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 50;
    this.reflectionRing = 0;
    this.reflectionRing2 = this.size * 0.7;
    this.strokeValue = 400;
    this.strokeValue2 = 400;
  }

  update() {
    noFill();
    stroke(100, this.strokeValue);
    if (this.reflectionRing < this.size * 2) {
      circle(this.pos.x, this.pos.y, this.reflectionRing);
      this.reflectionRing += 1;
      this.strokeValue -= 40 / (this.size * 2);
    }

    stroke(100, this.strokeValue2);
    if (this.reflectionRing2 < this.size * 2) {
      circle(this.pos.x, this.pos.y, this.reflectionRing2);
      this.reflectionRing2 += 1;
      this.strokeValue2 -= 40 / (this.size * 2);
    }
  }

  isFinished() {
    return this.reflectionRing >= this.size * 2 && this.reflectionRing2 >= this.size * 2;
  }
}

// ------------------ StarTrail ------------------
class Star {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(8, 16);
    this.alpha = 255;
    this.decay = 0.5; // slower fade
    this.glow = color(100, 200, 255, this.alpha);
  }

  update() {
    this.alpha -= this.decay;
    this.glow.setAlpha(this.alpha);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.glow);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = this.glow;
    this.drawStar(0, 0, this.size * 0.5, this.size, 5);
    pop();
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  isFaded() {
    return this.alpha <= 0;
  }
}



