/*controles the typed line in the lead: types the text letter by letter in front of the caret*/
const typedLine = document.querySelector("#typed-line");
const typedCaret = typedLine.querySelector(".caret");
const typedText = typedLine.dataset.text;

const typeDelay = 70;
const typeDelayRandom = 60;
const startAfterPreloader = 1300;
const startAfterTransition = 650;

let lettersTyped = 0;

function typeNextLetter() {
    if (lettersTyped >= typedText.length) return;

    typedLine.insertBefore(document.createTextNode(typedText[lettersTyped]), typedCaret);
    lettersTyped++;
    setTimeout(typeNextLetter, typeDelay + Math.random() * typeDelayRandom);
}

/* reduced motion: the whole line at once, otherwise wait for the preloader or the curtain */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typedLine.insertBefore(document.createTextNode(typedText), typedCaret);
} else {
    const isArriving = document.documentElement.classList.contains("is-arriving") || document.documentElement.classList.contains("has-loaded");
    setTimeout(typeNextLetter, isArriving ? startAfterTransition : startAfterPreloader);
}
