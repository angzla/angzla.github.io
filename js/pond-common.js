let koiFish = [];
let ripples = [];
let starTrail = [];

function commonSetup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textFont('Georgia');
  cursor();

  const saved = JSON.parse(localStorage.getItem('savedKoi'));
  if (saved) {
    koiFish = saved.map(f => {
      let k = new KoiFish(f.x, f.y);
      k.vel = createVector(f.vel[0], f.vel[1]);
      k.acc = createVector(f.acc[0], f.acc[1]);
      k.size = f.size;
      k.maxSpeed = f.maxSpeed;
      k.noiseOffset = f.noiseOffset;
      k.finWiggle = f.finWiggle;
      k.tailWiggle = f.tailWiggle;
      k.bodyColor = color(...f.bodyColor);
      k.eaten = f.eaten;
      k.isClicked = f.isClicked;
      k.message = f.message;
      k.spots = f.spots.map(s => ({
        x: s.x,
        y: s.y,
        w: s.w,
        h: s.h,
        c: color(...s.c)
      }));
      return k;
    });
  } else {
    for (let i = 0; i < 33; i++) {
      koiFish.push(new KoiFish(random(width), random(height)));
    }
  }
}

function updateKoi() {
  for (let koi of koiFish) {
    koi.update();
    koi.display();
  }
}

function attractKoi(mx, my) {
  let attractPoint = createVector(mx, my);
  ripples.push(new Ripple(mx,my))
  for (let koi of koiFish) {
    koi.attractTo(attractPoint);
  }
}

function ripple(mx, my) {
  ripples.push(new Ripple(mx,my))
}

function addFish() {
  koiFish.push(new KoiFish(random(width), random(height)));
}

function removeFish() {
  if (koiFish.length > 0) {
    koiFish.pop();
  }
}

function resetFish() {
  koiFish = [];
  for (let i = 0; i < 33; i++) {
    koiFish.push(new KoiFish(random(width), random(height)));
  }
  starTrail = [];
}

function freezeFish() {
  
}

function saveKoiState() {
  const state = koiFish.map(fish => ({
    x: fish.pos.x,
    y: fish.pos.y,
    vel: [fish.vel.x, fish.vel.y],
    acc: [fish.acc.x, fish.acc.y],
    size: fish.size,
    maxSpeed: fish.maxSpeed,
    noiseOffset: fish.noiseOffset,
    finWiggle: fish.finWiggle,
    tailWiggle: fish.tailWiggle,
    bodyColor: [red(fish.bodyColor), green(fish.bodyColor), blue(fish.bodyColor), alpha(fish.bodyColor)],
    spots: fish.spots.map(s => ({
      x: s.x,
      y: s.y,
      w: s.w,
      h: s.h,
      c: [red(s.c), green(s.c), blue(s.c), alpha(s.c)]
    })),
    eaten: fish.eaten,
    isClicked: fish.isClicked,
    message: fish.message
  }));
  localStorage.setItem('savedKoi', JSON.stringify(state));
}


