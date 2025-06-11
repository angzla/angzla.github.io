let cat;
let popups = [];
let isFrozen = false;

function preload() {
  cat = loadImage('cat.jpg');
}

function setup() {
    commonSetup();
    cursor();
  }
  
  function draw() {
    background(0, 50);
    updateKoi();

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (!isFrozen) ripples[i].update();
      if (ripples[i].isFinished()) {
        ripples.splice(i, 1);
      }
    }

    // Star trail
    for (let i = starTrail.length - 1; i >= 0; i--) {
      if (!isFrozen) starTrail[i].update();
      starTrail[i].display();
      if (starTrail[i].isFaded()) {
        starTrail.splice(i, 1);
      }
    }

  // Have koi follow the whole trail
  if (starTrail.length > 0)
    {for (let koi of koiFish) {
      if (!isFrozen) koi.followTrail(starTrail);
    }
  }

  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].update();
    popups[i].display();
    if (popups[i].isDone()) {
      popups.splice(i, 1); // remove finished animations
    }
  }
  
  
  }
  
  function mousePressed() {

    const input = document.getElementById("koiMessageInput");

    if (
      event.target.closest('#koiMessageInput') ||
      event.target.closest('#infoPopup') ||
      event.target.tagName === 'BUTTON') 
      return;
    
    let koiWasClicked = false;
    
    for (let koi of koiFish) {
      let d = dist(mouseX, mouseY, koi.pos.x, koi.pos.y);
      if (d < 20 && !koi.eaten) {
        koiWasClicked = true;
        // Coin toss
        if (random() < 0.7) {
          // Text bubble
          // const input = document.getElementById("koiMessageInput");
          input.style.display = "block";
          input.style.position = "absolute";
          input.style.left = `${mouseX + 10}px`;
          input.style.top = `${mouseY - 10}px`;

          const clickedKoi = koi;
          input.onkeydown = null;

          // When the user presses Enter, store the message and hide the input
          input.onkeydown = (e) => {
            if (e.key === "Enter") {
              clickedKoi.message = input.value.trim() || "✨ blub blub ✨";
              clickedKoi.isClicked = true;
              clickedKoi.clickTime = millis();
              input.value = "";
              input.style.display = "none";
            }
          };
        } else {
          // Cat eats fish
          koi.eaten = true;
          popups.push(new Cat(cat));
        }
        return;
      }
    }

    if (!koiWasClicked) {
      input.style.display = "none";
    }

    ripple(mouseX, mouseY);
  }

  function mouseDragged() {
    if (event.target.tagName === 'BUTTON') return;
    starTrail.push(new Star(mouseX, mouseY));
    return false; // prevent default drag behavior
  }
  
  
  window.addEventListener('beforeunload', saveKoiState);
