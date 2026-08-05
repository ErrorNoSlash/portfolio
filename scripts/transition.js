// controles the terminal page transition between internal pages
const transitionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// overlay is up before first paint, fades out once the page is ready
if (sessionStorage.getItem("transitionCmd") !== null) {
    document.documentElement.classList.add("transitioning");
}

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".page-transition");
    const log = document.getElementById("transition-log");
    if (!overlay || !log) return;

    showLandingCommand(log);

    document.querySelectorAll("a[href]").forEach((link) => {
        const url = new URL(link.getAttribute("href"), location.href);

        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname) return;
        if (link.target === "_blank") return;

        link.addEventListener("click", (e) => {
            e.preventDefault();
            leaveTo(link, url, overlay, log);
        });
    });
});

// shows the command that was typed on the previous page
function showLandingCommand(log) {
    const cmd = sessionStorage.getItem("transitionCmd");
    if (cmd === null) return;

    sessionStorage.removeItem("transitionCmd");
    log.textContent = cmd + "\nok.";

    setTimeout(() => {
        document.documentElement.classList.remove("transitioning");
    }, transitionReduced ? 0 : 300);
}

// types the cd command, then navigates
function leaveTo(link, url, overlay, log) {
    const command = "$ cd " + (link.dataset.path || url.pathname);

    sessionStorage.setItem("transitionCmd", command);
    overlay.classList.add("active");

    if (transitionReduced) {
        location.href = url.href;
        return;
    }

    log.textContent = "";
    let i = 0;

    function type() {
        if (i >= command.length) {
            setTimeout(() => (location.href = url.href), 160);
            return;
        }

        log.textContent += command[i];
        i++;
        setTimeout(type, 14);
    }

    type();
}

// coming back through the browser cache, make sure nothing is stuck
window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;

    const overlay = document.querySelector(".page-transition");
    if (overlay) overlay.classList.remove("active");

    document.documentElement.classList.remove("transitioning");
});
