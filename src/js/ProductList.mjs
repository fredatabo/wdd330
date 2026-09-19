import { renderListWithTemplate } from "./utils.mjs";

// Builds the markup for a single product card.
// Kept as one small function (instead of hand-written HTML in main.js)
// so the ProductList class only has to know "how to get a string of HTML
// for a product" — not the layout details of the card itself.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Image.replace("../", "")}"
        alt="Image of the ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // async so we can await the promise returned by dataSource.getData()
  // instead of chaining .then() everywhere this class is used.
  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);

    // Optional: reflect which category is being shown.
    const heading = document.querySelector(".products h2");
    if (heading) {
      heading.textContent = `Top Products: ${this.category}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
