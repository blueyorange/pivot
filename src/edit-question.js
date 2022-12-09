import PivotQuestion from "./PivotQuestion";
customElements.define("pivot-question", PivotQuestion);

function renderPreviewFromForm(form) {
  const formData = new FormData(form);
  const body = formData.get("body");
  const choices = formData.getAll("choices");
  document.querySelector("pivot-question").question = { body, choices };
}

renderPreviewFromForm(document.querySelector("form"));

document
  .querySelector("form")
  .addEventListener("input", (e) => renderPreviewFromForm(e.target.form));
