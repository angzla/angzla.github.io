let koiFish = [];

function commonSetup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noCursor();
  textFont('Georgia');

  for (let i = 0; i < 20; i++) {
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
  for (let koi of koiFish) {
    koi.attractTo(attractPoint);
  }
}
