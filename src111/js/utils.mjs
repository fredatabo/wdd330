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
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = qs("#main-header");
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = qs("#main-footer");
  renderWithTemplate(footerTemplate, footerElement);
}

// grab a parameter value out of the current page's URL query string.
// e.g. getParam("category") on ?category=tents returns "tents"
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
