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

/* start typing once the preloader or the curtain is out of the way */
const isArriving = document.documentElement.classList.contains("is-arriving") || document.documentElement.classList.contains("has-loaded");
setTimeout(typeNextLetter, isArriving ? startAfterTransition : startAfterPreloader);
