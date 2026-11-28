/*mail links: if nothing opens after a click (no mail app set up), a small card offers mail.html,
  with the address and a few open-source mail apps. a mail app opening takes the focus away from
  the page or hides it; if neither happens within a moment, the card shows*/

const mailHintText = {"head": "Opende er niets?", "body": "Misschien staat er geen mail-app ingesteld op dit toestel.", "go": "Andere manieren om te mailen", "close": "Sluiten", "page": "mail.html"};
let mailHint = null;
let mailHintTimer = 0;

function hideMailHint() {
    if (mailHint) mailHint.classList.remove("is-shown");
}

function showMailHint() {
    if (!mailHint) {
        mailHint = document.createElement("div");
        mailHint.className = "mail-hint";
        mailHint.setAttribute("role", "status");
        const head = document.createElement("strong");
        head.textContent = mailHintText.head;
        const body = document.createElement("span");
        body.textContent = mailHintText.body;
        const actions = document.createElement("div");
        actions.className = "mail-hint-actions";
        const go = document.createElement("a");
        go.className = "pill mail-hint-go";
        go.href = mailHintText.page;
        go.textContent = mailHintText.go;
        const close = document.createElement("button");
        close.type = "button";
        close.className = "pill";
        close.textContent = mailHintText.close;
        close.addEventListener("click", hideMailHint);
        actions.append(close, go);
        mailHint.append(head, body, actions);
        document.body.append(mailHint);
    }
    requestAnimationFrame(function () { mailHint.classList.add("is-shown"); });
}

// call after a mail link was opened (also used by scripts that open mail themselves)
function watchMailOpen() {
    clearTimeout(mailHintTimer);
    hideMailHint();
    function opened() {
        clearTimeout(mailHintTimer);
        window.removeEventListener("blur", opened);
        document.removeEventListener("visibilitychange", hidden);
    }
    function hidden() { if (document.hidden) opened(); }
    window.addEventListener("blur", opened);
    document.addEventListener("visibilitychange", hidden);
    mailHintTimer = setTimeout(function () {
        opened();
        if (document.hasFocus() && !document.hidden) showMailHint();
    }, 1600);
}
window.watchMailOpen = watchMailOpen;

document.addEventListener("click", function (e) {
    const link = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (link && !e.defaultPrevented) watchMailOpen();
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideMailHint();
});
