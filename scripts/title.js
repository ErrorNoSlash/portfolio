/*big titles: every letter gets its own <span> so the CSS can spread them across the row and let them rise in.
  A title rises when it scrolls into view; the first one waits for the preloader or the curtain*/
const titleStartAfterPreloader = "0.95s";
const titleStartAfterTransition = "0.45s";
const titleStartOnScroll = "0.1s";

const titles = [...document.querySelectorAll(".title")];
// no preloader this time (curtain or already seen), so the title starts sooner
const isArrivingPage = document.documentElement.classList.contains("is-arriving") || document.documentElement.classList.contains("has-loaded");

titles.forEach(function (title, titleIndex) {
    const word = title.querySelector("h1, h2");
    const text = word.textContent.trim();

    word.setAttribute("aria-label", text);

    // the number of letters sets the font size, so short and long words both fill the row
    title.style.setProperty("--letters", text.length);

    if (titleIndex === 0) {
        title.style.setProperty("--start", isArrivingPage ? titleStartAfterTransition : titleStartAfterPreloader);
    } else {
        title.style.setProperty("--start", titleStartOnScroll);
    }

    title.querySelectorAll(".echo, h1, h2").forEach(function (element) {
        element.replaceChildren(...[...text].map(function (letter, index) {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.setProperty("--i", index);
            return span;
        }));
    });
});

/* start a title's animation once a quarter of it is on screen */
const titleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        titleObserver.unobserve(entry.target);
    });
}, { threshold: 0.25 });

titles.forEach(function (title) {
    titleObserver.observe(title);
});

/* back / forward can bring the page back from the browser cache: let the titles rise again */
window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;

    titles.forEach(function (title) {
        title.classList.remove("is-visible");
        title.querySelectorAll("span").forEach(function (span) {
            span.style.animation = "none";
            span.getBoundingClientRect();
            span.style.animation = "";
        });
        titleObserver.observe(title);
    });
});
