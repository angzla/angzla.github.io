let koiFish = [];
let ripples = [];

function commonSetup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textFont('Georgia');
  cursor();

  for (let i = 0; i < 33; i++) {
    koiFish.push(new KoiFish(random(width), random(height)));
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
}

