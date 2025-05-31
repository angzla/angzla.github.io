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
  
  }
  
  function mousePressed() {
    if (event.target.tagName === 'BUTTON') return;
    attractKoi(mouseX, mouseY);
  }
  
  window.addEventListener('beforeunload', saveKoiState);