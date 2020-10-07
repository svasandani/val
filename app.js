let currentpath = window.location.pathname;

let app = document.getElementById("app");

let parser = new DOMParser();

var scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

let firstload = true;

let cursor = document.querySelector(".cursor");
let cursordot = document.querySelector(".cursor-dot");
let toAnim = [];
let oldmousex = 0;
let oldmousey = 0;
let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
const lerpf = 0.25;
let preloader = document.querySelector(".preloader");
let centerchanger = null;

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

let navlinks = document.querySelectorAll("nav a");

navlinks.forEach((nl) => {
    nl.addEventListener('click', (e) => {
        e.preventDefault();

        if (nl.pathname == currentpath) return;
        
        doHide();

        setTimeout(() => { loadPage(nl.pathname); }, 400);
    });
});

pageData = {
    "index": {
        "title": "Valeria Sofia",
        "path": "/",
        "markup": "index",
        "customMarkupFunction": () => {
            // rearrange intro
        },
    },
    "work": {
        "title": "Work — Valeria Sofia",
        "path": "/work",
        "markup": "work",
        "customMarkupFunction": () => {
            console.log("hi");
        },
    },
    "contact": {
        "title": "Contact — Valeria Sofia",
        "path": "/contact",
        "markup": "contact",
        "customMarkupFunction": () => {
            console.log("hi");
        },
    },
    "unknown": {
        "title": "404 — Valeria Sofia",
        "path": "/404",
        "markup": "404",
        "customMarkupFunction": () => {
            console.log("hi");
        },
    }
}

loadPage(currentpath);

function loadPage(path) {
    if (path == "/") {
        doLoad(pageData.index);
    } else if (path == "/work") {
        doLoad(pageData.work);
    } else if (path == "/contact") {
        doLoad(pageData.contact);
    } else if (path == "/test.html") {
        doLoad(pageData.test);
    } else {
        doLoad(pageData.unknown);
    }

    currentpath = path;
}

function doLoad(data) {
    history.pushState({ "path": data.path }, null, data.path);

    let markupurl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/assets/markup/" + data.markup;

    fetch(markupurl)
        .then((r) => { return r.text(); })
        .then((d) => {
            let doc = parser.parseFromString(d, "text/html");

            app.innerHTML = doc.body.innerHTML;
        })
        .then(() => {
            document.title = data.title;

            data.customMarkupFunction();

            doPreload();

            doAnims();
                        
            firstload = false;
        });    
}

function doHide() {
    let hider = document.querySelector(".hider");
    hider.classList.add("hiding");
}

function doPreload() {
    scrollTo(0,0);

    let toSlide = document.querySelectorAll(".unslided");

    if (firstload) {
        let preloader = document.querySelector(".preloader");
        preloader.classList.add("loaded");
    } else {
        let hider = document.querySelector(".hider");
        if(hider.classList.contains("hiding")) { setTimeout(() => { hider.classList.remove("hiding"); }, 800); }
    }

    document.body.classList.remove("unloaded");
    document.body.classList.add("loaded");
    
    toSlide.forEach((t) => {
        setTimeout(() => { 
            t.classList.remove("unslided"); t.classList.add("slided"); 
        }, 600);
    });
}

function doAnims() {
    let changer = document.querySelectorAll(".changer");
    
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

    toAnim = Array.from(document.querySelectorAll(".unchanged"));

    let toLoad = document.querySelectorAll("img.unloaded");

    const show = (t) => {
        if (t.classList.contains("unloaded")) { t.classList.remove("unloaded"); }
        t.classList.add("loaded");
    };

    toLoad.forEach((t) => {
        t.addEventListener('load', () => { show(t); })

        setTimeout(() => { show(t); }, 2000);
    });

    loop();
}

function loop() {
    toAnim.forEach((t, i) => {
        if (isElementInViewport(t)) {
            t.classList.remove("unchanged");
            t.classList.add("changed");
            toAnim.splice(i,1);
        }
    });

    if (screen.width > 1000) {
        cursor.style.left = lerp(oldmousex, mouseX, lerpf) + "px";
        cursor.style.top = lerp(oldmousey, mouseY, lerpf) + "px";
        oldmousex = lerp(oldmousex, mouseX, lerpf);
        oldmousey = lerp(oldmousey, mouseY, lerpf);
        
        cursordot.style.left = lerp(oldmousex, dotX, 0.95) + "px";
        cursordot.style.top = lerp(oldmousey, dotY, 0.95) + "px";
    }

    scroll(loop);
}

window.onpopstate = function (event) {
    if(event.state) {
        loadPage(event.state.path);
    }
}

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