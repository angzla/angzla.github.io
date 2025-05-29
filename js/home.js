function setup() {
    commonSetup();
  }
  
  function draw() {
    background(0, 50);
    updateKoi();
  }
  
  function mousePressed() {
    attractKoi(mouseX, mouseY);
  }  