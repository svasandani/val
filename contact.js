let contact = document.querySelector("aside#contact");

let form = contact.querySelector("form");

let fd = new FormData();

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

    fd.append("email", form.querySelector("#email").value);
    fd.append("msg", form.querySelector("#msg").value);

    fetch('https://script.google.com/macros/s/AKfycbz6tMsCM6sBDRqmXmzOcNKn_smhZR-CcN1F323xn36ISDJ8OWgL/exec', {
        method: 'POST',
        body: fd,
    })
    
    setTimeout(hideContact, 2000);

    form.style.opacity = 0;

    setTimeout(() => { ending.classList.add("finished"); }, 600);
})
