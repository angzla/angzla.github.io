let lilyPads = [];
let flowers = [];

function setup() {
  commonSetup();
  cursor();

  let padLabels = [
    { label: "StarrySwarm", link: "https://angzla.github.io/projects/StarrySwarm", size: 130 },
    { label: "Planet Music", link: "https://angzla.github.io/projects/planetmusic", size: 130 },
    { label: "Lost In Translation", link: "https://angzla.github.io/projects/lostintranslation", size: 130 },
    { label: "Tattoo Doodler", link: "https://angzla.github.io/projects/tattoodoodler", size: 130 },
    { label: "Headset Audio Translator", link: "https://github.com/angzla/audio_translate_unity", size: 130 },
    { label: "Image Playlist Generator", link: "https://github.com/angzla/image-playlist-generator", size: 130 },
    { label: "TV Show Logger", link: "https://github.com/angzla/Numberboxd-Final", size: 130 },
    { label: "LA County Redistricting", link: "https://github.com/angzla/LA-County-Redistricting", size: 130 }
  ];

  let cols = 3;
  let spacingX = width / (cols + 1);
  let rows = ceil(padLabels.length / cols);
  let spacingY = height / (rows + 2);

  for (let i = 0; i < padLabels.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = spacingX * (col + 1);
    let y = spacingY * (row + 1);

    let padData = padLabels[i];
    let pad = new LilyPad(x, y, padData.label, padData.link, padData.size);
    lilyPads.push(pad);

    let sizeFactor = (pad.size * 0.6) / 29;
    flowers.push(new Flower(255, 166, 0, pad.pos.x, pad.pos.y + pad.size / 2, 3, 1, 0, sizeFactor));
  }
}

function draw() {
  background(0, 50);
  updateKoi();

  for (let i = 0; i < lilyPads.length; i++) {
    lilyPads[i].ripple();
    lilyPads[i].display();
    flowers[i].update();
  }
}

function mousePressed() {
  for (let pad of lilyPads) {
    if (pad.contains(mouseX, mouseY)) {
      window.open(pad.link, "_blank");
      return;
    }
  }

  attractKoi(mouseX, mouseY);
}
