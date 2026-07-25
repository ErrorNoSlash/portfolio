// controles the terminal boot screen (replaces the old preloader)
document.addEventListener("DOMContentLoaded", () => {
    const boot = document.querySelector(".boot");
    const log = document.getElementById("boot-log");
    if (!boot || !log) return;

    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry && navEntry.type === "reload";
    const hasVisited = sessionStorage.getItem("hasVisited");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
        boot.classList.add("done");
        setTimeout(() => boot.remove(), 500);
    };

    if ((hasVisited && !isReload) || reducedMotion) {
        boot.remove();
        return;
    }

    sessionStorage.setItem("hasVisited", "true");

    const lines = [
        "booting dias@stas ...",
        "loading modules ......... ok",
        "mounting /projecten ..... ok",
        "starting ascii-engine ... ok",
        "welcome."
    ];

    let i = 0;
    const nextLine = () => {
        if (i >= lines.length) {
            setTimeout(finish, 350);
            return;
        }
        log.textContent += lines[i] + "\n";
        i++;
        setTimeout(nextLine, 180);
    };

    nextLine();
});
