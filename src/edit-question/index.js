import pivotQuestion from "../components/pivotQuestion.js";
import { render } from 'lit';

const previewNode = document.querySelector("#question-preview");

function renderPreviewFromForm(form) {
  const formData = new FormData(form);
  const body = formData.get("body");
  const choices = formData.getAll("choices");
  render(pivotQuestion(
    { body, choices },
    { disabled: true }
  ), previewNode);
  renderMathInElement(previewNode, {
    delimiters: [
      {
        left: "$$",
        right: "$$",
        display: true,
      },
      {
        left: "$",
        right: "$",
        display: false,
      },
    ],
  });
}

renderPreviewFromForm(document.querySelector("form"));

document
  .querySelector("form")
  .addEventListener("input", (e) => renderPreviewFromForm(e.target.form));
