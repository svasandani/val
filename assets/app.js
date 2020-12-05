let currentpath = window.location.pathname;
let currentdata = null;

let app = document.getElementById("app");

let scribble = document.querySelector(".scribble");

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
let oldscrollamt = 0;
let scrollamt = 0;
let scrollt = 0;
let target = 0;
let ticks = Array(1).fill([0,0]);
let ticksptr = 0;
let tlast = () => { return ticksptr == 0 ? (ticks.length - 1) : ticksptr - 1; }
let tenqueue = (toenqueue) => { ticks[tlast()] = toenqueue; }
let tdequeue = () => { let t = ticksptr; ticksptr = (ticksptr == (ticks.length - 1) ? 0 : ticksptr + 1); return ticks[t]; }
let wheeling = false;
const lerpf = 0.15;
let preloader = document.querySelector(".preloader");
let centerchanger = null;
let resizetext = null;

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

    if (scrollt != 0) {
        scrollamt = oldscrollamt + ((e.clientY - scrollt) * 1.2);
    }
});

window.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains("no-scroll")) return;
    wheeling = false;
    if (screen.width > 1000) scrollt = e.clientY;
});

window.addEventListener('mouseup', () => {
    scrollt = 0;
    oldscrollamt = scrollamt;
    if (scrollamt > 0) falltozero(1);
    if (scrollamt < (window.innerHeight - app.offsetHeight - 25)) falltoheight(1);
});

window.addEventListener('wheel', (e) => {
    // if ((target + event.deltaY * -0.3 > 0 && event.deltaY * -1 > 0) || (target - event.deltaY * -0.3 < (window.innerHeight - app.offsetHeight - 25) && event.deltaY * -1 < 0)) return;

    if ((scrollamt > -10 && scrollamt + event.deltaY * -1 > 10) || (scrollamt < (window.innerHeight - app.offsetHeight + 5) && scrollamt + event.deltaY * -1 < (window.innerHeight - app.offsetHeight - 15))) {
        wheeling = false;
        return;
    }

    if (wheeling) target += event.deltaY * -0.7;
    else target = scrollamt + event.deltaY * -0.7;
    wheeling = true;
});

let navlinks = document.querySelectorAll("nav a");

navlinks.forEach((nl) => {
    nl.addEventListener('click', (e) => {
        e.preventDefault();

        if (nl.pathname == currentpath) return;
        
        doHide();

        setTimeout(() => { loadPage(nl.pathname, true); }, 400);
    });
});

pageData = {
    "index": {
        "title": "Valeria Sofia",
        "path": "/",
        "markup": "index",
        "customOnload": () => {
            resizetext = () => {
                const getNewDiv = () => {
                    let slice = document.createElement("div");
                    slice.classList.add("slide-up");

                    let p = document.createElement("p");
                    if (document.querySelector("h1").classList.contains("unslided")) { p.classList.add("unslided"); }
                    else p.classList.add("slided");

                    slice.appendChild(p);

                    return { "div": slice, "p": p };
                };

                let statement = document.querySelector(".artist-statement");
                statement.style.letterSpacing = (screen.width > 1000 ? "0.15em" : "0.12em");
                let text = statement.dataset.text;

                statement.innerHTML = "";

                let activeline = getNewDiv();
                activeline.p.innerHTML = text.charAt(0);
                
                for(let i = 1; i < text.length; i++) {
                    statement.appendChild(activeline.div);
                    let height = statement.offsetHeight;
                    activeline.p.innerHTML += text.charAt(i);
                    if (statement.offsetHeight > height) {
                        activeline.p.innerHTML = activeline.p.innerHTML.slice(0, -1);
                        activeline = getNewDiv();
                        activeline.p.innerHTML = text.charAt(i);
                    } else {
                        statement.removeChild(activeline.div);
                    }
                }
                statement.appendChild(activeline.div);
                statement.style.letterSpacing = "0em";
            }

            resizetext();

            window.addEventListener('resize', resizetext);

            let scrollbtn = document.querySelector(".scroll-btn-container");

            scrollbtn.addEventListener('click', (e) => {
                e.preventDefault();

                falltosetamt(25 - window.innerHeight, 1);
            });
        },
        "customOffload": () => {
            window.removeEventListener('resize', resizetext);
        }
    },
    "work": {
        "title": "Work — Valeria Sofia",
        "path": "/work",
        "markup": "work",
        "customOnload": () => {
            console.log("hi");
        },
        "customOffload": () => {
            console.log("bye");
        }
    },
    "contact": {
        "title": "Contact — Valeria Sofia",
        "path": "/contact",
        "markup": "contact",
        "customOnload": () => {
            let form = document.querySelector("form");

            let fd = new FormData();

            let ending = contact.querySelector(".ending");

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                fd.append("email", form.querySelector("#email").value);
                fd.append("msg", form.querySelector("#msg").value);

                fetch('https://script.google.com/macros/s/AKfycbz6tMsCM6sBDRqmXmzOcNKn_smhZR-CcN1F323xn36ISDJ8OWgL/exec', {
                    method: 'POST',
                    body: fd,
                })

                form.style.opacity = 0;

                setTimeout(() => { ending.classList.add("finished"); }, 600);
            })
        },
        "customOffload": () => {
            console.log("bye");
        }
    },
    "unknown": {
        "title": "404 — Valeria Sofia",
        "path": "/404",
        "markup": "404",
        "customOnload": () => {
            resizetext = () => {
                const getNewDiv = () => {
                    let slice = document.createElement("div");
                    slice.classList.add("slide-up");

                    let p = document.createElement("p");
                    if (document.querySelector("h1").classList.contains("unslided")) { p.classList.add("unslided"); }
                    else p.classList.add("slided");

                    slice.appendChild(p);

                    return { "div": slice, "p": p };
                };

                let statement = document.querySelector(".artist-statement");
                statement.style.letterSpacing = (screen.width > 1000 ? "0.15em" : "0.12em");
                let text = statement.dataset.text;

                statement.innerHTML = "";

                let activeline = getNewDiv();
                activeline.p.innerHTML = text.charAt(0);
                
                for(let i = 1; i < text.length; i++) {
                    statement.appendChild(activeline.div);
                    let height = statement.offsetHeight;
                    activeline.p.innerHTML += text.charAt(i);
                    if (statement.offsetHeight > height) {
                        activeline.p.innerHTML = activeline.p.innerHTML.slice(0, -1);
                        activeline = getNewDiv();
                        activeline.p.innerHTML = text.charAt(i);
                    } else {
                        statement.removeChild(activeline.div);
                    }
                }
                statement.appendChild(activeline.div);
                statement.style.letterSpacing = "0em";
            }

            resizetext();

            window.addEventListener('resize', resizetext);
        },
        "customOffload": () => {
            console.log("bye");
        }
    }
}

loadPage(currentpath, true);

function loadPage(path, pushState) {
    if (currentdata != null) currentdata.customOffload();

    if (path == "/") {
        currentdata = pageData.index;
        doLoad(pageData.index, pushState);
    } else if (path == "/work") {
        currentdata = pageData.work;
        doLoad(pageData.work, pushState);
    } else if (path == "/contact") {
        currentdata = pageData.contact;
        doLoad(pageData.contact, pushState);
    } else {
        currentdata = pageData.unknown;
        doLoad(pageData.unknown, pushState);
    }

    currentpath = path;
}

function doLoad(data, pushState) {
    if (pushState) history.pushState({ "path": data.path }, null, data.path);

    let markupurl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/assets/markup/" + data.markup;

    fetch(markupurl)
        .then((r) => { return r.text(); })
        .then((d) => {
            let doc = parser.parseFromString(d, "text/html");

            app.innerHTML = doc.body.innerHTML;
        })
        .then(() => {
            document.title = data.title;

            data.customOnload();

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
    scrollamt = 0;
    oldscrollamt = 0;
    if (screen.width < 1000) scrollTo(0,0);

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

    scribble = document.querySelector(".scribble");
}

function doAnims() {
    let changer = document.querySelectorAll(".changer");
    
    changer.forEach((c) => {
        c.addEventListener("mouseover", (e) => {
            if (c.classList.contains("center-changer") && scrollt == 0) {
                // cursor.classList.add("anim");
                centerchanger = c;
            }
    
            if (scrollt == 0) {
                cursor.classList.add("changed");
                if (c.classList.contains("no-hover")) { c.classList.remove("no-hover"); }
            } else c.classList.add("no-hover");
        })
        
        c.addEventListener("mouseout", () => {
            if (c.classList.contains("center-changer")) {
                // if (cursor.classList.contains("anim")) { setTimeout(() => { cursor.classList.remove("anim"); }, 400); }
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

        setTimeout(() => { show(t); }, 3000);
    });

    loop();
}

function falltozero(level) {
    if (scrollt != 0) return;

    if (scrollamt >= 0) {
        if (scrollamt - 8 < 0) {
            scrollamt = 0;
            oldscrollamt = 0;
        } else {
            scrollamt -= 8;
            oldscrollamt = scrollamt;
            if (level == 30) {
                setTimeout(() => { falltozero(level); }, 1);
            } else {
                setTimeout(() => { falltozero(level + 1); }, (30 / level));
            }
            
        }
    }
}

function falltoheight(level) {
    if (scrollt != 0) return;

    if (scrollamt <= (window.innerHeight - app.offsetHeight - 25)) {
        if (scrollamt + 8 > (window.innerHeight - app.offsetHeight - 25)) {
            scrollamt = (window.innerHeight - app.offsetHeight - 25);
            oldscrollamt = (window.innerHeight - app.offsetHeight - 25);
        } else {
            scrollamt += 8;
            oldscrollamt = scrollamt;
            if (level == 30) {
                setTimeout(() => { falltoheight(level); }, 1);
            } else {
                setTimeout(() => { falltoheight(level + 1); }, (30 / level));
            }
            
        }
    }
}

function falltosetamt(amt, level) {
    if (scrollamt < amt) falltosetamtfrombelow(amt, level);
    else if (scrollamt > amt) falltosetamtfromabove(amt, level);
    else return;
}

function falltosetamtfrombelow(amt, level) {
    if (scrollt != 0) return;

    if (scrollamt <= amt) {
        if (scrollamt + 8 > amt) {
            scrollamt = amt;
            oldscrollamt = amt;
        } else {
            scrollamt += 8;
            oldscrollamt = scrollamt;
            if (level == 30) {
                setTimeout(() => { falltosetamtfrombelow(amt, level); }, 1);
            } else {
                setTimeout(() => { falltosetamtfrombelow(amt, level + 1); }, (30 / level));
            }
        }
    }
}

function falltosetamtfromabove(amt, level) {
    if (scrollt != 0) return;

    if (scrollamt >= amt) {
        if (scrollamt - 8 < amt) {
            scrollamt = amt;
            oldscrollamt = amt;
        } else {
            scrollamt -= 8;
            oldscrollamt = scrollamt;
            if (level == 30) {
                setTimeout(() => { falltosetamtfromabove(amt, level); }, 1);
            } else {
                setTimeout(() => { falltosetamtfromabove(amt, level + 1); }, (30 / level));
            }
        }
    }
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
        tenqueue([lerp(oldmousex, mouseX, lerpf),lerp(oldmousey, mouseY, lerpf)]);

        let td = tdequeue();

        oldmousex = td[0];
        oldmousey = td[1];

        cursor.style.left = lerp(oldmousex, mouseX, lerpf) + "px";
        cursor.style.top = lerp(oldmousey, mouseY, lerpf) + "px";
        
        cursordot.style.left = lerp(oldmousex, dotX, 0.95) + "px";
        cursordot.style.top = lerp(oldmousey, dotY, 0.95) + "px";
        
        app.style.transform = "translate3d(0px, " + scrollamt + "px, 0px) scale(" + (scrollt == 0 ? "1" : "0.9") + ")";
        scribble.style.transform = "translate3d(0px, " + (-1 * scrollamt) + "px, 0px)";

        if (wheeling) {
            if (Math.abs(scrollamt - target) < 50 && (scrollamt > 0 || scrollamt < (window.innerHeight - app.offsetHeight - 25))) wheeling = false;
            else {
                scrollamt = lerp(scrollamt, target, 0.6);
                oldscrollamt = scrollamt;
            }
        } else {
            if (!(scrollamt > 0 && scrollamt < (window.innerHeight - app.offsetHeight))) {
                if (scrollamt > 0) falltozero(1);
                if (scrollamt < (window.innerHeight - app.offsetHeight - 25)) falltoheight(1);
            }
        }
    }

    scroll(loop);
}

window.onpopstate = function (event) {
    if(event.state) {
        loadPage(event.state.path, false);
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