/*controles the copy button next to the mail address*/
const copyButton = document.querySelector("#copy-mail");
const copyLabel = copyButton.textContent;
const copyResetTime = 1600;

function showCopyResult(text) {
    copyButton.textContent = text;
    copyButton.classList.add("is-active");

    setTimeout(function () {
        copyButton.textContent = copyLabel;
        copyButton.classList.remove("is-active");
    }, copyResetTime);
}

/* copy the address, the button says if it worked */
copyButton.addEventListener("click", function () {
    if (!navigator.clipboard) return showCopyResult("lukt niet hier");

    navigator.clipboard.writeText(copyButton.dataset.mail).then(function () {
        showCopyResult("gekopieerd ✓");
    }).catch(function () {
        showCopyResult("lukt niet hier");
    });
});
