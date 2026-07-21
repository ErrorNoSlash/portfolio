// terminal page transition between internal pages
const pageTransition = () => document.querySelector(".page-transition");
const transitionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// entering: overlay is up before first paint, fades out once the page is ready
if (sessionStorage.getItem("transitionCmd") !== null) {
    document.documentElement.classList.add("transitioning");
}

document.addEventListener("DOMContentLoaded", () => {
    const overlay = pageTransition();
    const log = document.getElementById("transition-log");
    if (!overlay || !log) return;

    const cmd = sessionStorage.getItem("transitionCmd");
    if (cmd !== null) {
        sessionStorage.removeItem("transitionCmd");
        log.textContent = cmd + "\nok.";
        setTimeout(() => {
            document.documentElement.classList.remove("transitioning");
        }, transitionReduced ? 0 : 300);
    }

    // leaving: type the cd command, then navigate
    document.querySelectorAll("a[href]").forEach((link) => {
        const url = new URL(link.getAttribute("href"), location.href);
        const internal = url.origin === location.origin;
        const samePage = url.pathname === location.pathname;
        if (!internal || samePage || link.target === "_blank") return;

        link.addEventListener("click", (e) => {
            e.preventDefault();
            const command = "$ cd " + (link.dataset.path || url.pathname);
            sessionStorage.setItem("transitionCmd", command);
            overlay.classList.add("active");

            if (transitionReduced) {
                location.href = url.href;
                return;
            }

            log.textContent = "";
            let i = 0;
            const type = () => {
                if (i >= command.length) {
                    setTimeout(() => (location.href = url.href), 160);
                    return;
                }
                log.textContent += command[i];
                i++;
                setTimeout(type, 14);
            };
            type();
        });
    });
});

// coming back through the browser cache: make sure nothing is stuck
window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    const overlay = pageTransition();
    if (overlay) overlay.classList.remove("active");
    document.documentElement.classList.remove("transitioning");
});
