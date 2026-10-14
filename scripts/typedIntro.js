/*controles the typed line in the lead: types the text letter by letter in front of the caret*/
const introLine = document.querySelector("#typed-line");
const introCaret = introLine.querySelector(".caret");
const introText = introLine.dataset.text;

const typeDelay = 70;
const typeDelayRandom = 60;
const startAfterPreloader = 1300;
const startAfterTransition = 650;

let lettersTyped = 0;

// types one letter in front of the caret, then waits a little (random, like a person)
function typeNextLetter() {
    if (lettersTyped >= introText.length) return;

    introLine.insertBefore(document.createTextNode(introText[lettersTyped]), introCaret);
    lettersTyped++;
    setTimeout(typeNextLetter, typeDelay + Math.random() * typeDelayRandom);
}

/* reduced motion: the whole line at once, otherwise wait for the preloader or the curtain */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    introLine.insertBefore(document.createTextNode(introText), introCaret);
} else {
    const isArriving = document.documentElement.classList.contains("is-arriving") || document.documentElement.classList.contains("has-loaded");
    setTimeout(typeNextLetter, isArriving ? startAfterTransition : startAfterPreloader);
}
