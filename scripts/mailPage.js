/*mail.html: apply the saved light / dark choice before the page is drawn (dark unless light was
  picked), and make the copy button work once the page is there*/

try {
    if (localStorage.getItem("theme") === "light") document.documentElement.dataset.theme = "light";
} catch (error) { }

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".mail-copy");
    const address = document.getElementById("mail-address");
    if (!button || !address || !navigator.clipboard) return;
    const label = button.textContent;
    button.hidden = false;
    button.addEventListener("click", function () {
        navigator.clipboard.writeText(address.textContent.trim()).then(function () {
            button.textContent = button.dataset.copied;
            setTimeout(function () { button.textContent = label; }, 1800);
        });
    });
});
