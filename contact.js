let contact = document.querySelector("aside#contact");

let form = contact.querySelector("form");

let contactbtn = document.querySelector(".contact-btn");

let ending = contact.querySelector(".ending");

let hide = true;

let hideContact = () => {
    if (contact.classList.contains("show")) { contact.classList.remove("show"); hide = true; }
}

contactbtn.addEventListener('click', () => {
    if (hide) {
        contact.classList.add("show");
        // document.body.classList.remove("loaded");
        // document.body.classList.add("unloaded");
        hide = false;
    } else {
        contact.classList.remove("show");
        // document.body.classList.remove("unloaded");
        // document.body.classList.add("loaded");
        hide = true;
    }
});

window.addEventListener('scroll', hideContact);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    setTimeout(hideContact, 2000);

    form.style.opacity = 0;

    setTimeout(() => { ending.classList.add("finished"); }, 600)
})
