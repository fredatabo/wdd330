import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// wire up the sort dropdown: whenever the selection changes, re-sort the
// already-fetched list in place (no extra API call needed).
const sortSelect = document.querySelector("#sort");
sortSelect.addEventListener("change", (event) => {
  myList.sortList(event.target.value);
});
