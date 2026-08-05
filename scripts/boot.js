// controles the terminal boot screen (replaces the old preloader)
document.addEventListener("DOMContentLoaded", () => {
    const boot = document.querySelector(".boot");
    const log = document.getElementById("boot-log");
    if (!boot || !log) return;

    // sessionStorage throws a SecurityError under file:// in Firefox and
    // Safari (it's a valid origin restriction, not a bug) — guard it so a
    // thrown error here can't leave the boot screen stuck over the site
    // forever. worst case without storage: the boot animation just plays
    // on every load instead of only the first.
    function readVisited() {
        try {
            return sessionStorage.getItem("hasVisited");
        } catch {
            return null;
        }
    }

    function writeVisited() {
        try {
            sessionStorage.setItem("hasVisited", "true");
        } catch {
            // ignore — see note above
        }
    }

    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry && navEntry.type === "reload";
    const hasVisited = readVisited();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
        boot.classList.add("done");
        setTimeout(() => boot.remove(), 500);
    };

    if ((hasVisited && !isReload) || reducedMotion) {
        boot.remove();
        return;
    }

    writeVisited();

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
