/*controles the mail composer on the contact screen: the command updates while you type the subject,
  and sending opens your own mail app with the subject and message already filled in*/
const composeForm = document.querySelector("#compose");
const composeSubject = composeForm.querySelector("[name='subject']");
const composeBody = composeForm.querySelector("[name='body']");
const composePreview = composeForm.querySelector("#compose-preview");
const composeDefaultSubject = composeSubject.placeholder;

/* the subject shows up in the mail command as you type it */
composeSubject.addEventListener("input", function () {
    composePreview.textContent = composeSubject.value.trim() || composeDefaultSubject;
});

/* send: build a mailto link, so nothing leaves the page without the visitor's own mail app */
composeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const subject = composeSubject.value.trim() || composeDefaultSubject;
    const body = composeBody.value.trim();
    let mailLink = `mailto:${composeForm.dataset.mail}?subject=${encodeURIComponent(subject)}`;
    if (body) mailLink += `&body=${encodeURIComponent(body)}`;

    window.location.href = mailLink;
});
