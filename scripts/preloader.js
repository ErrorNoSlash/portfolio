/*controles the preloader*/
const preloader = document.querySelector("#preloader");
const preloaderFill = document.querySelector("#preloader-fill");
const preloaderCount = document.querySelector("#preloader-count");

const minimumTime = 900;
const maximumTime = 3000;
const fadeTime = 450;
const startTime = performance.now();

let isPageLoaded = document.readyState === "complete";

/* the page has loaded: the bar may go to 100% */
window.addEventListener("load", function () {
    isPageLoaded = true;
})

// the preloader plays once per visit: the tab remembers it (window.name also works when the site is opened from files)
function rememberPreloader() {
    window.name = "preloaderSeen";
    try {
        sessionStorage.setItem("preloaderSeen", "true");
    } catch (error) { }
}

// fades the preloader out and removes it
function hidePreloader() {
    rememberPreloader();
    preloader.classList.add("is-done");
    setTimeout(function () {
        preloader.remove();
    }, fadeTime);
}

// moves the bar and the counter, every frame, until 100%
function updateProgress() {
    const elapsed = performance.now() - startTime;
    const timeProgress = Math.min(elapsed / minimumTime, 1);

    // wait at 90% until the page is loaded, but never longer than maximumTime
    const canFinish = isPageLoaded || elapsed >= maximumTime;
    const progress = canFinish ? timeProgress : Math.min(timeProgress, 0.9);
    const percent = Math.round(progress * 100);

    preloaderFill.style.width = `${percent}%`;
    preloaderCount.textContent = percent;

    if (percent < 100) requestAnimationFrame(updateProgress);
    else hidePreloader();
}

/* skip the preloader when it already played this visit, when arriving from another page or when motion is reduced, otherwise start counting */
const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasSeenPreloader = document.documentElement.classList.contains("has-loaded");

if (hasSeenPreloader || document.documentElement.classList.contains("is-arriving") || isReducedMotion) {
    rememberPreloader();
    preloader.remove();
} else {
    requestAnimationFrame(updateProgress);
}
