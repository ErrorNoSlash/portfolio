/*controles the curtain between the home page and the project pages*/
const pageTransition = document.querySelector("#page-transition");
const htmlElement = document.documentElement;
const storageKey = "pageTransition";
const coverTime = 550;
const maximumWaitTime = 600;

let isLeaving = false;

function goToPage(url) {
    if (isLeaving) return;
    isLeaving = true;

    try {
        sessionStorage.setItem(storageKey, "true");
    } catch (error) { }

    // the next page reads ?via=curtain, so it knows to skip the preloader even when storage is kept apart (pages opened from files)
    const nextUrl = new URL(url);
    nextUrl.searchParams.set("via", "curtain");

    pageTransition.classList.add("is-covering");
    setTimeout(function () {
        window.location.href = nextUrl.href;
    }, coverTime);
}

function revealPage() {
    if (!htmlElement.classList.contains("is-arriving")) return;

    try {
        sessionStorage.removeItem(storageKey);
    } catch (error) { }

    // same position as the arriving state, so nothing jumps
    pageTransition.classList.add("is-covering");
    htmlElement.classList.remove("is-arriving");
    pageTransition.getBoundingClientRect();

    pageTransition.classList.replace("is-covering", "is-exiting");
    setTimeout(function () {
        pageTransition.classList.remove("is-exiting");
    }, coverTime);
}

document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href);
    if (url.protocol !== location.protocol || url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return;

    e.preventDefault();
    goToPage(url.href);
})

window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    isLeaving = false;
    pageTransition.classList.remove("is-covering", "is-exiting");
    try {
        sessionStorage.removeItem(storageKey);
    } catch (error) { }
})

if (htmlElement.classList.contains("is-arriving")) {
    document.fonts.ready.then(revealPage);
    setTimeout(revealPage, maximumWaitTime);
}
