let cursor = document.querySelector(".cursor");

let haswork = true;

var scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

let changer = document.querySelectorAll(".changer");

changer.forEach((c) => {
    c.addEventListener("mouseover", () => {
        cursor.classList.add("changed");
    })
    
    c.addEventListener("mouseout", () => {
        if (cursor.classList.contains("changed")) { cursor.classList.remove("changed"); }
    })
});

let toAnim = Array.from(document.querySelectorAll(".unchanged"));

let toLoad = document.querySelectorAll("img.unloaded");

toLoad.forEach((t) => {
    t.addEventListener('load', () => {
        if (t.classList.contains("unloaded")) { t.classList.remove("unloaded"); }
        t.classList.add("loaded");
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

    toAnim.forEach((t, i) => {
        if (isElementInViewport(t)) {
            t.classList.remove("unchanged");
            t.classList.add("changed");
            toAnim.splice(i,1);
        }
    });

    if (screen.width > 1000) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    }

    scroll(loop);
}

loop();

// Helper function from: http://stackoverflow.com/a/7557433/274826
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      (rect.top <= 0
        && rect.bottom >= 0)
      ||
      (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight))
      ||
      (rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}