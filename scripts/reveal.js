/*controles the reveal animations: rows, cells, tiles and links fade and rise in, one after the other, when they come into view.
  They play on every load (also a reload, and when the browser brings the page back from its cache)*/
const revealTargets = [
    ".section-head > *",
    ".lead > *",
    ".doors .link-row",
    ".marquee",
    ".status-item",
    ".dot-matrix",
    ".project-list .link-row",
    ".preview-pane",
    ".profile",
    ".about-text p",
    ".skill",
    ".social-list .link-row",
    ".compose-field",
    ".compose-send",
    ".mail-bar > *",
    ".icon-row .icon-link",
    ".project-text > *",
    ".project-features-head",
    ".feature-list li",
    ".project-links .link-row",
    ".project-visual",
    ".sitemap-item",
    ".site-footer"
].join(", ");

const revealStagger = 70;
const revealStartAfterPreloader = 1000;
const revealStartAfterTransition = 450;
const revealTime = 700;

const revealElements = [...document.querySelectorAll(revealTargets)];
let revealObserver = null;

// the place of an element among its revealed brothers and sisters, so they come in one after the other
function revealIndex(element) {
    const siblings = [...element.parentElement.children].filter(function (child) {
        return revealElements.includes(child);
    });
    return Math.max(0, siblings.indexOf(element));
}

// lets one element fade and rise in
function revealElement(element) {
    element.classList.add("is-revealed");

    // when it is done, the element gets its own transitions back (hover effects)
    setTimeout(function () {
        element.classList.remove("will-reveal", "is-revealed");
    }, revealTime + revealIndex(element) * revealStagger + 50);
}

// from now on every element reveals as soon as it comes into view
function startRevealing() {
    revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            revealElement(entry.target);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
}

// hides every element (a bit lower) and gives it its place in line for the delay
function hideForReveal() {
    revealElements.forEach(function (element) {
        element.classList.remove("is-revealed");
        element.classList.add("will-reveal");
        element.style.setProperty("--reveal-i", revealIndex(element));
    });
}

/* hide everything, then start revealing */
hideForReveal();

// wait for the preloader, or only for the curtain when coming from another page
const html = document.documentElement;
const skipsPreloader = html.classList.contains("is-arriving") || html.classList.contains("has-loaded");
setTimeout(startRevealing, skipsPreloader ? revealStartAfterTransition : revealStartAfterPreloader);

// back / forward can bring the page back from the browser cache: play everything again
window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    if (revealObserver) revealObserver.disconnect();
    hideForReveal();
    setTimeout(startRevealing, revealStartAfterTransition);
});
