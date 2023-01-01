import { marked } from "marked";
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

export default function pivotQuestion(question) {
  const { body, choices } = question;
  console.log('>>>>>>>>>', body, choices);
  const bodyHTML = marked.parse(body);
  const choicesHTML = choices.map((c) => marked.parse(c));
  const handleClick = (e) => e.target.form.querySelector('[type="submit"]').removeAttribute('disabled');
  return html`
    <div class="question">
      ${unsafeHTML(bodyHTML)}
      <form>
        ${choicesHTML
      .map(
        (choice, i) => html`
        <div class="form-check">
        <input
        class="form-check-input"
          name="answer"
          type="radio"
          name="answer"
          id="choice-${i}"
          @click="${handleClick}"
      />
              <label class="form-check-label" for="choice-${i}">
                ${unsafeHTML(choice)}
              </label>
      </div>
              `
      )}
      <input type="submit" class="btn btn-primary" disabled/>
      </form>
    </div>
  `;
}
