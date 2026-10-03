import { renderWithTemplate, qs, setLocalStorage } from "./utils.mjs";

// Builds the markup for the product detail section.
function productDetailsTemplate(product) {
  const colorName = product.Colors?.[0]?.ColorName ?? "";
  return `<h3>${product.Brand.Name}</h3>

    <h2 class="divider">${product.NameWithoutBrand}</h2>

    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.Name}"
    />

    <p class="product-card__price">$${product.FinalPrice}</p>

    <p class="product__color">${colorName}</p>

    <p class="product__description">
      ${product.DescriptionHtmlSimple ?? ""}
    </p>

    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));

    // reflect the product name in the tab title
    const titleElement = qs("title");
    if (titleElement) {
      titleElement.textContent = `Sleep Outside | ${this.product.Name}`;
    }
  }

  addProductToCart() {
    setLocalStorage("so-cart", this.product);
  }

  renderProductDetails() {
    renderWithTemplate(
      productDetailsTemplate(this.product),
      qs(".product-detail"),
    );
  }
}
