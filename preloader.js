let doWork = () => { }

let toSlide = document.querySelectorAll(".unslided");

let preloader = document.querySelector(".preloader");

window.addEventListener('load', () => {
    preloader.classList.add("loaded");
    document.body.classList.remove("unloaded");
    document.body.classList.add("loaded");
    
    toSlide.forEach((t) => {
        setTimeout(() => { 
            t.classList.remove("unslided"); t.classList.add("slided"); 
        }, 600);
    });

});