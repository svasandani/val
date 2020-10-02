let cursor = document.querySelector(".cursor");

let haswork = true;

var scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

let changer = document.querySelectorAll(".changer");

changer.forEach((c) => {
    c.addEventListener("mouseover", () => {
        cursor.classList.add("changed");
        console.log(c);
    })
    
    c.addEventListener("mouseout", () => {
        if (cursor.classList.contains("changed")) { cursor.classList.remove("changed"); }
    })
});

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function loop() {
    if (haswork) {
      try {
        doWork();
      } catch(e) {
        haswork = false;
      }
    }

    if (screen.width > 1000) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    }

    scroll(loop);
}

loop();