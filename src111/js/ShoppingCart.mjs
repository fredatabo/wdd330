import { getLocalStorage, renderListWithTemplate, qs } from "./utils.mjs";

// Builds the markup for a single cart line item.
function cartItemTemplate(item) {
  const colorName = item.Colors?.[0]?.ColorName ?? "";
  const image = item.Images?.PrimaryMedium ?? item.Image;
  return `<li class="cart-card divider">
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${image}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  init() {
    this.renderCartContents();
  }

  renderCartContents() {
    // getLocalStorage returns null if the "so-cart" key has never been set
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems.length === 0) {
      this.parentElement.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
      this.renderCartTotal(cartItems);
      return;
    }

    renderListWithTemplate(cartItemTemplate, this.parentElement, cartItems);
    this.renderCartTotal(cartItems);
  }

  renderCartTotal(cartItems) {
    const totalElement = qs(".cart-total");
    if (!totalElement) return;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      totalElement.textContent = "";
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}
