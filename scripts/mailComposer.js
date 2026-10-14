/*controles the mail composer on the contact screen: the command updates while you type the subject,
  and sending opens your own mail app with the subject and message already filled in*/
const mailForm = document.querySelector("#mail-composer");
const subjectField = mailForm.querySelector("[name='subject']");
const messageField = mailForm.querySelector("[name='body']");
const commandSubject = mailForm.querySelector("#compose-preview");
const defaultSubject = subjectField.placeholder;

/* the subject shows up in the mail command as you type it */
subjectField.addEventListener("input", function () {
    commandSubject.textContent = subjectField.value.trim() || defaultSubject;
});

/* send: build a mailto link, so nothing leaves the page without the visitor's own mail app */
mailForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const subject = subjectField.value.trim() || defaultSubject;
    const body = messageField.value.trim();
    let mailLink = `mailto:${mailForm.dataset.mail}?subject=${encodeURIComponent(subject)}`;
    if (body) mailLink += `&body=${encodeURIComponent(body)}`;

    window.location.href = mailLink;
});
