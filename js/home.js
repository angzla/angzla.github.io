let cat;
let popups = [];
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

  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].update();
    popups[i].display();
    if (popups[i].isDone()) {
      popups.splice(i, 1); // remove finished animations
    }
  }
  
  
  }
  
  function mousePressed() {
    if (event.target.tagName === 'BUTTON') return;

    // Check if a fish was clicked
    for (let koi of koiFish) {
      let d = dist(mouseX, mouseY, koi.pos.x, koi.pos.y);
      if (d < 20 && !koi.eaten) {
        // Coin toss
        if (random() < 0.7) {
          // Text bubble
          // Show input box and position it near the koi
          const input = document.getElementById("koiMessageInput");
          input.style.display = "block";
          input.style.position = "absolute";
          input.style.left = `${mouseX + 10}px`;
          input.style.top = `${mouseY - 10}px`;
          input.focus();

          const clickedKoi = koi;
          input.onkeydown = null;

          // When the user presses Enter, store the message and hide the input
          input.onkeydown = (e) => {
            if (e.key === "Enter") {
              // clickedKoi.message = input.value;
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

    attractKoi(mouseX, mouseY);
  }

  function mouseDragged() {
    if (event.target.tagName === 'BUTTON') return;
    starTrail.push(new Star(mouseX, mouseY));
    return false; // prevent default drag behavior
  }
  
  
  window.addEventListener('beforeunload', saveKoiState);
