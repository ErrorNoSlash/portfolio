/*controles the project preview: pointing at or focusing a project row shows its preview next to the list*/
const projectRows = [...document.querySelectorAll(".project-list [data-preview]")];
const projectPreviews = [...document.querySelectorAll(".preview")];

function showPreview(slug) {
    projectPreviews.forEach(function (preview) {
        preview.hidden = preview.id !== `preview-${slug}`;
    });
    projectRows.forEach(function (row) {
        row.classList.toggle("is-current", row.dataset.preview === slug);
    });
}

/* the mouse or the keyboard picks the project */
projectRows.forEach(function (row) {
    row.addEventListener("pointerenter", function () {
        showPreview(row.dataset.preview);
    });
    row.addEventListener("focus", function () {
        showPreview(row.dataset.preview);
    });
});

showPreview(projectRows[0].dataset.preview);
