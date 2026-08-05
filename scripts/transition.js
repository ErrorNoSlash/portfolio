// controles the terminal page transition between internal pages
const transitionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// sessionStorage throws a SecurityError under file:// in Firefox and
// Safari (a valid origin restriction, not a bug). guard every access —
// without it, this script's first line would throw and abort before ever
// reaching the code below that attaches link click handlers, breaking the
// whole transition system. worst case without storage: internal links
// just navigate normally, without the typed-command animation.
function readTransitionCmd() {
    try {
        return sessionStorage.getItem("transitionCmd");
    } catch {
        return null;
    }
}

function writeTransitionCmd(value) {
    try {
        sessionStorage.setItem("transitionCmd", value);
    } catch {
        // ignore — see note above
    }
}

function clearTransitionCmd() {
    try {
        sessionStorage.removeItem("transitionCmd");
    } catch {
        // ignore — see note above
    }
}

// overlay is up before first paint, fades out once the page is ready
if (readTransitionCmd() !== null) {
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
    const cmd = readTransitionCmd();
    if (cmd === null) return;

    clearTransitionCmd();
    log.textContent = cmd + "\nok.";

    setTimeout(() => {
        document.documentElement.classList.remove("transitioning");
    }, transitionReduced ? 0 : 300);
}

// types the cd command, then navigates
function leaveTo(link, url, overlay, log) {
    const command = "$ cd " + (link.dataset.path || url.pathname);

    writeTransitionCmd(command);
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
