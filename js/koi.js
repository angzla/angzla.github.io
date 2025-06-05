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
      this.eaten = false;
      this.isClicked = false;
      this.message =  "✨ blub blub ✨"
  
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

      let eatRadius = max(this.size, 10);
      let target = null;
      let minDist = Infinity;
    
      // Find the closest uneaten star
      for (let i = 0; i < trail.length; i++) {
        let star = trail[i];
        if (!star.beingEaten) {
          let d = dist(this.pos.x, this.pos.y, star.pos.x, star.pos.y);
          if (d < minDist) {
            minDist = d;
            target = star;
          }
    
          // If close enough, eat the star
          if (d < eatRadius) {
            star.beingEaten = true;
            star.fadeStartedAt = millis();
          }
        }
      }
    
      // If there's a valid target, move toward it
      if (target) {
        let desired = p5.Vector.sub(target.pos, this.pos);
        let d = desired.mag();
    
        let distanceFactor = constrain(d / 100, 0, 1);
        let speed = lerp(0.5, this.maxSpeed, distanceFactor);
        speed = constrain(speed, 0.5, this.maxSpeed);
        desired.setMag(speed);
    
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
    
        this.acc.add(steer);
      }
    
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);


    }

    drawFishBones() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
    
      // White glowing stroke
      stroke(255);
      strokeWeight(2);
      noFill();
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255);
    
      const bodyWidth = this.size * 2.4;
      const bodyHeight = this.size;
    
      // Draw spine
      const spineStart = -bodyWidth / 2;
      const spineEnd = bodyWidth / 2;
      line(spineStart, 0, spineEnd, 0);
    
      // Draw ribs
      const numRibs = 6;
      const ribSpacing = bodyWidth / (numRibs + 1);
      const ribLength = bodyHeight * 0.6;
    
      for (let i = 1; i <= numRibs; i++) {
        const x = spineStart + i * ribSpacing;
        line(x, 0, x, -ribLength / 2);
        line(x, 0, x, ribLength / 2);
      }
    
      // Tail
      const tailLength = this.size * 0.8;
      const tailAngle = PI / 6;
      line(spineStart, 0, spineStart - cos(tailAngle) * tailLength, -sin(tailAngle) * tailLength);
      line(spineStart, 0, spineStart - cos(tailAngle) * tailLength, sin(tailAngle) * tailLength);
    
      // Head
      noStroke();
      fill(255);
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(255);
      const headW = this.size * 0.5;
      const headH = this.size * 1.2;
      // triangle(spineEnd, 0, spineEnd + headW, -headH / 2, spineEnd + headW, headH / 2);
      triangle(spineEnd, 0, spineEnd - headW, -headH / 2, spineEnd - headW, headH / 2);

    
      // Eye
      fill(0);
      ellipse(spineEnd - headW * 0.6, -headH * 0.2, this.size * 0.1);
    
      pop();
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

      if (this.eaten) {
        this.drawFishBones();
        return; 
      }

      //draw koi as usual 
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
        
      // Tail
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
    
      // Fins
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

      // If clicked, show text
      if (this.isClicked) {
        fill(255);
        textSize(12);
        textAlign(CENTER);
        text(this.message, this.pos.x, this.pos.y - 20);
      } else {
        this.isClicked = false;
      }

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
    this.beingEaten = false;      // start fading only once eaten
    this.fadeStartedAt = 0;       // track fade start time
    this.fadeDuration = 500;     // fade duration in milliseconds
    this.glow = color(100, 200, 255, this.alpha);
  }

  update() {
    this.glow.setAlpha(this.alpha);
    if (this.beingEaten) {
      let elapsed = millis() - this.fadeStartedAt;
      this.alpha = map(elapsed, 0, this.fadeDuration, 255, 0);
      this.alpha = constrain(this.alpha, 0, 255);
    }
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

  isFaded() {
    return this.alpha <= 0;
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
}

// ------------------ CAT ------------------
class Cat {
  constructor(img) {
    this.img = img;
    this.x = width - 280;
    this.y = height + 100;
    this.velocity = -10;
    this.state = "up";
    this.opacity = 200;
  }

  update() {
    if (this.state === "up") {
      this.y += this.velocity;
      if (this.y < height - 250) {
        this.state = "down";
        this.velocity = 10;
      }
    } else if (this.state === "down") {
      this.y += this.velocity;
      this.opacity -= 1;
      if (this.y > height + 200) {
        this.state = "done";
      }
    }
  }

  display() {
    if (this.state === "done") return;
    push();
    tint(255, this.opacity);
    image(this.img, this.x, this.y, 300, 300);
    pop();
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("MEOW", this.x, this.y);
  }

  isDone() {
    return this.state === "done";
  }
}




