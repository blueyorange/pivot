import pivotQuestion from '../components/pivotQuestion';
import spinner from '../components/spinner';
import { html, render } from 'lit';

const renderRoot = document.querySelector('#app-root');
let state = { isLoading: true };

const socket = io();
const pollId = window.location.href.split("/").pop();
socket.emit("teacher", pollId, (err, data) => {
  state = { ...state, ...data };
  console.log(state);
  if (err) {
    alert(err)
  }
  state.isLoading = false;
  update(state);
});

function app(state) {
  const { question } = state;
  return state.isLoading ? html`${spinner()}` : html`${pivotQuestion(question)}`;
}

function update(state) {
  render(app(state), renderRoot)
}

socket.on("names", (names) => {
  console.log(names);
  console.log(`${names.length} in room`);
  document.querySelector("#join-status").innerHTML = `${names.length} in room`;
  document.querySelector("#student-list").innerHTML = names
    .map((name) => `<span class="badge rounded-pill bg-primary">${name}</span>`)
    .reduce((acc, curr) => (acc += curr), []);
});
