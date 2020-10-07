let path = window.location.pathname;

let app = document.getElementById("app");

let parser = new DOMParser();

let firstload = true;

pageData = {
    "index": {
        "title": "Valeria Sofia",
        "path": "/index",
        "markup": "index",
    },
    "work": {
        "title": "Work — Valeria Sofia",
        "path": "/work"
    },
    "contact": {
        "title": "Contact — Valeria Sofia",
        "path": "/contact"
    },
    "unknown": {
        "title": "404 — Valeria Sofia",
        "path": "/404"
    },
    "test": {
        "title": "Test — Valeria Sofia",
        "path": "/test.html",
        "markup": "index",
    }
}

loadPage(path);
    
firstload = false;

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
}

function doLoad(data) {
    history.pushState(data, null, data.path);

    let markupurl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/assets/markup/" + data.markup;

    fetch(markupurl)
        .then((r) => { return r.text(); })
        .then((d) => {
            let doc = parser.parseFromString(d, "text/html");

            console.log(doc);

            app.innerHTML = doc.body.innerHTML;
        });

    document.title = data.title;
}

window.onpopstate = function (event) {
    if(event.state) {
        loadPage(event.state.path);
    }
}