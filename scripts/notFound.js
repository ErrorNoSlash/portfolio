/*404: shows the path the visitor actually tried, for a bit of terminal flavour*/
const missingPath = location.pathname;

if (missingPath && missingPath !== "/") {
    document.querySelectorAll("#missing-path, #missing-path-log").forEach(function (element) {
        element.textContent = `.${missingPath}`;
    });
}
