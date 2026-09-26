import { renderListWithTemplate } from "./utils.mjs";

// Builds the markup for a single product card.
// Kept as one small function (instead of hand-written HTML in main.js)
// so the ProductList class only has to know "how to get a string of HTML
// for a product" — not the layout details of the card itself.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="Image of the ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// turns "sleeping-bags" into "Sleeping Bags", "tents" into "Tents", etc.
function formatCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);

    // Reflect which category is being shown, e.g. "Top Products: Backpacks"
    const heading = document.querySelector(".products h2");
    if (heading && this.category) {
      heading.textContent = `Top Products: ${formatCategoryName(this.category)}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
