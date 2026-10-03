// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// render a list of items into a parent element using a template function.
// templateFn: a function that takes one item and returns an HTML string.
// parentElement: the DOM node the generated markup is inserted into.
// list: the array of data items to render.
// position: where insertAdjacentHTML should place the markup (defaults to "afterbegin").
// clear: when true (default), empties the parent element before rendering.
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render a single template (string of HTML) into a parent element.
// template: a string of HTML to insert.
// parentElement: the DOM node the markup is inserted into.
// data: optional data that gets handed to the callback (e.g. the product
//   used to build the template) so the callback can wire up behavior
//   (like animating a cart badge) after the markup is in the DOM.
// callback: optional function invoked after the template has been inserted.
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch the contents of an HTML file (e.g. a partial) and return it as a string.
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

// load the header and footer partials from src/public/partials and render
// them into the #main-header and #main-footer placeholder elements that
// live in each page's HTML.
//
// import.meta.env.BASE_URL is Vite's configured "base" (e.g. "/" locally,
// or "/repo-name/" once built for GitHub Pages). Using it here -- both to
// fetch the partial files and to fill in any {{BASE}} placeholders inside
// them -- means the header/footer work correctly no matter how deep the
// current page is nested (src/index.html vs. src/cart/index.html) or what
// sub-path the whole site is deployed under.
export async function loadHeaderFooter() {
  const base = import.meta.env.BASE_URL;

  const headerTemplate = await loadTemplate(`${base}partials/header.html`);
  const headerElement = qs("#main-header");
  renderWithTemplate(headerTemplate.replaceAll("{{BASE}}", base), headerElement);

  const footerTemplate = await loadTemplate(`${base}partials/footer.html`);
  const footerElement = qs("#main-footer");
  renderWithTemplate(footerTemplate.replaceAll("{{BASE}}", base), footerElement);
}

// grab a parameter value out of the current page's URL query string.
// e.g. getParam("category") on ?category=tents returns "tents"
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
