let cursor = document.querySelector(".cursor");
let cursordot = document.querySelector(".cursor-dot");

let haswork = true;

var scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

let centerchanger = null;
let changer = document.querySelectorAll(".changer");
let lerpf = 0.25;

changer.forEach((c) => {
    c.addEventListener("mouseover", () => {
        if (c.classList.contains("center-changer")) {
            centerchanger = c;
        }

        cursor.classList.add("changed");
    })
    
    c.addEventListener("mouseout", () => {
        if (c.classList.contains("center-changer")) {
            centerchanger = null;
        }

        if (cursor.classList.contains("changed")) { cursor.classList.remove("changed"); }
    })
});

let toAnim = Array.from(document.querySelectorAll(".unchanged"));

let toLoad = document.querySelectorAll("img.unloaded");

const show = (t) => {
    if (t.classList.contains("unloaded")) { t.classList.remove("unloaded"); }
    t.classList.add("loaded");
};

toLoad.forEach((t) => {
    t.addEventListener('load', () => { show(t); })

    setTimeout(() => { show(t); }, 2000);
});

let oldmousex = 0;
let oldmousey = 0;
let mouseX = 0;
let mouseY = 0;

let dotX = 0;
let dotY = 0;

window.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    if (centerchanger == null) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    } else {
      mouseX = centerchanger.getBoundingClientRect().left + (centerchanger.clientWidth / 2);
      mouseY = centerchanger.getBoundingClientRect().top + (centerchanger.clientHeight / 2);
    }
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
        console.log(oldmousex, mouseX, lerp(oldmousex, mouseX, 0.002));
        cursor.style.left = lerp(oldmousex, mouseX, lerpf) + "px";
        cursor.style.top = lerp(oldmousey, mouseY, lerpf) + "px";
        oldmousex = lerp(oldmousex, mouseX, lerpf);
        oldmousey = lerp(oldmousey, mouseY, lerpf);
        
        cursordot.style.left = dotX + "px";
        cursordot.style.top = dotY + "px";
    }

    scroll(loop);
}

loop();

function lerp(o, n, f) {
    return Math.floor((1 - f) * o + f * n);
}

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