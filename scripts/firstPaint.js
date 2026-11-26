/*runs in <head> before the page is drawn, so it is a plain script and not deferred: a visit over plain
  http is sent to https, and the page learns whether to show the preloader or the curtain.
  ?via=curtain (added by pageTransition.js) means we came through the curtain: no preloader, and it leaves
  the address bar again. back / forward and a return visit (localStorage) never show the preloader either.
  storage is only a backup, some browsers keep it apart per file*/

// the site only works over https; github pages does this too, this catches it if that is ever off
if (location.protocol === "http:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    location.replace("https://" + location.host + location.pathname + location.search + location.hash);
}

try {
    const html = document.documentElement;
    const pageUrl = new URL(location.href);
    const navigation = performance.getEntriesByType("navigation")[0];

    if (pageUrl.searchParams.get("via") === "curtain") {
        html.classList.add("is-arriving");
        pageUrl.searchParams.delete("via");
        history.replaceState(history.state, "", pageUrl.pathname + pageUrl.search + pageUrl.hash);
    }
    if (navigation && navigation.type === "back_forward") html.classList.add("has-loaded");
    if (window.name === "preloaderSeen" || sessionStorage.getItem("preloaderSeen")) html.classList.add("has-loaded");
    if (sessionStorage.getItem("pageTransition")) html.classList.add("is-arriving");
    if (localStorage.getItem("preloaderSeen")) html.classList.add("has-loaded");
} catch (error) { }
