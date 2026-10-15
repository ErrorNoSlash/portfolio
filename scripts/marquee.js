/*marquee: repeat the phrase until it is twice as wide as the row, so the loop never shows a gap (for every marquee on the page)*/
const marqueeSpeed = 60;

const marquees = [...document.querySelectorAll(".marquee")].map(function (row) {
    const track = row.querySelector("span");
    return { row: row, track: track, phrase: track.textContent, lastRowWidth: 0 };
});

// fills one marquee with copies of its phrase and sets its speed
function fillMarquee(marquee) {
    marquee.track.textContent = marquee.phrase;

    const phraseWidth = marquee.track.getBoundingClientRect().width;
    const copies = Math.max(2, Math.ceil((marquee.row.clientWidth * 2) / phraseWidth));

    // an even number of copies keeps the -50% loop seamless
    marquee.track.textContent = marquee.phrase.repeat(copies + (copies % 2));

    // same speed in pixels per second on every screen
    const trackWidth = marquee.track.getBoundingClientRect().width;
    marquee.track.style.animationDuration = `${trackWidth / 2 / marqueeSpeed}s`;
    marquee.lastRowWidth = marquee.row.clientWidth;
}

// fills every marquee on the page
function fillAllMarquees() {
    marquees.forEach(fillMarquee);
}

fillAllMarquees();
document.fonts.ready.then(fillAllMarquees);

// phones fire resize while scrolling (the address bar), so only rebuild when the width really changed
window.addEventListener("resize", function () {
    marquees.forEach(function (marquee) {
        if (marquee.row.clientWidth !== marquee.lastRowWidth) fillMarquee(marquee);
    });
})

/* a marquee only runs while it can be seen, so a slow laptop does not keep drawing rows you scrolled past */
const marqueeWatcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        entry.target.classList.toggle("is-paused", !entry.isIntersecting);
    });
});

/* watch every marquee on the page */
marquees.forEach(function (marquee) {
    marqueeWatcher.observe(marquee.row);
});
