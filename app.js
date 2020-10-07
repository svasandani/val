let path = window.location.pathname;

let firstload = true;

pageData = {
    "index": {
        "title": "Valeria Sofia",
        "path": "/index"
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
    } else {
        doLoad(pageData.unknown);
    }
}

function doLoad(data) {
    history.pushState( data, null, data.path);

    document.title = data.title;
}