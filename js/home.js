function setup() {
    commonSetup();
    cursor();
  }
  
  function draw() {
    // background(0, 50);
    background(255, 255, 255, 50);
    updateKoi();
  }
  
  function mousePressed() {
    attractKoi(mouseX, mouseY);
  }  