function setup() {
    commonSetup();
    cursor();
  }
  
  function draw() {
    background(0, 50);
    updateKoi();

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      if (ripples[i].isFinished()) {
        ripples.splice(i, 1);
      }
    }

    // Star trail
    for (let i = starTrail.length - 1; i >= 0; i--) {
      starTrail[i].update();
      starTrail[i].display();
      if (starTrail[i].isFaded()) {
        starTrail.splice(i, 1);
      }
    }

  // Have koi follow the whole trail
  if (starTrail.length > 0)
    {for (let koi of koiFish) {
      koi.followTrail(starTrail);
  }
}
  
  }
  
  function mousePressed() {
    if (event.target.tagName === 'BUTTON') return;
    attractKoi(mouseX, mouseY);
  }

  function mouseDragged() {
    if (event.target.tagName === 'BUTTON') return;
    starTrail.push(new Star(mouseX, mouseY));
    return false; // prevent default drag behavior
  }
  
  
  window.addEventListener('beforeunload', saveKoiState);
