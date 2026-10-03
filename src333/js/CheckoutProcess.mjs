import { getLocalStorage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const TAX_RATE = 0.06; // 6% sales tax
const BASE_SHIPPING = 10; // first item
const ADDITIONAL_ITEM_SHIPPING = 2; // each item after the first

// takes the items currently stored in the cart (localStorage) and returns
// them in the simplified form the server expects.
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // localStorage key holding the cart, e.g. "so-cart"
    this.outputSelector = outputSelector; // where the order summary lives
    this.list = [];
    this.itemTotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  // Called on page load: totals up the cart and displays the subtotal.
  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice,
      0,
    );
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    if (subtotalElement) {
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  // Called once the user fills in the zip code: calculates tax, shipping,
  // and the order total, then displays them.
  calculateOrderTotal() {
    this.tax = this.itemTotal * TAX_RATE;
    this.shipping =
      this.list.length > 0
        ? BASE_SHIPPING + (this.list.length - 1) * ADDITIONAL_ITEM_SHIPPING
        : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`,
    );
    const totalElement = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
    if (shippingElement)
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    if (totalElement)
      totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  // Called on form submit: builds the order object the server expects and
  // sends it via ExternalServices.checkout().
  async checkout(form) {
    const formValues = formDataToJSON(form);

    const order = {
      ...formValues,
      orderDate: new Date().toISOString(),
      orderTotal: this.orderTotal.toFixed(2),
      tax: this.tax.toFixed(2),
      shipping: this.shipping,
      items: packageItems(this.list),
    };

    const services = new ExternalServices();
    return services.checkout(order);
  }
}
