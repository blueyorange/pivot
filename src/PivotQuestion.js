import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

export default class PivotQuestion extends LitElement {
  static styles = css`
    img {
      width: 100%;
      height: auto;
    }

    label {
      width: 100%;
      margin-bottom: 5px;
      display: inline-block;
      background-color: #ddd;
      padding: 10px 20px;
      border: 2px solid #444;
      border-radius: 6px;
      text-emphasis: bold;
    }

    label:hover {
      border-color: yellow;
    }

    input[type="radio"] {
      opacity: 0;
      position: fixed;
      width: 0;
    }

    input[type="radio"]:checked + label {
      background-color: rgb(252, 255, 187);
      border-color: rgb(205, 201, 67);
    }

    input[type="radio"]:focus + label {
      border: 2px dashed #444;
    }
  `;

  static get properties() {
    return {
      question: {
        type: Object,
        body: { type: String },
        choices: [{ type: String }],
      },
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._bodyHTML = "";
    this._choicesHTML = [];
  }

  set question(q) {
    console.log(this._bodyHTML);
    this._bodyHTML = marked.parse(q.body);
    this._choicesHTML = q.choices.map((c) => marked.parse(c));
    // this.question.choices = q.choices.map((c) => marked.parse(c));
    this.requestUpdate("question");
  }

  render() {
    return html`
      <form>
        ${unsafeHTML(this._bodyHTML)}
        ${this._choicesHTML.map(
          (choice, i) => html`
            <input
              type="radio"
              ?disabled=${this.disabled}
              id="choice-${i}"
              name="answer"
            />
            <label class="form-check-label" for="choice-${i}">
              ${unsafeHTML(marked.parse(choice))}
            </label>
          `
        )}
      </form>
    `;
  }
}
