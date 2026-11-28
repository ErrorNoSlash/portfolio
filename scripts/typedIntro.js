/*controls the typed line in the lead: types the text letter by letter in front of the caret.
  screen readers get the whole line at once (the hidden copy in the html), not the letters as they come*/
const introLine = document.querySelector("#typed-line");
const introTyped = introLine.querySelector(".typed-text");
const introText = introLine.dataset.text;

const typeDelay = 70;
const typeDelayRandom = 60;
const startAfterPreloader = 1300;
const startAfterTransition = 650;

let lettersTyped = 0;

// types one letter in front of the caret, then waits a little (random, like a person)
function typeNextLetter() {
    if (lettersTyped >= introText.length) return;

    introTyped.append(introText[lettersTyped]);
    lettersTyped++;
    setTimeout(typeNextLetter, typeDelay + Math.random() * typeDelayRandom);
}

/* start typing once the preloader or the curtain is out of the way */
const isArriving = document.documentElement.classList.contains("is-arriving") || document.documentElement.classList.contains("has-loaded");
setTimeout(typeNextLetter, isArriving ? startAfterTransition : startAfterPreloader);
