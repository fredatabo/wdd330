import CheckoutProcess from "./CheckoutProcess.mjs";
import { qs } from "./utils.mjs";

const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
checkoutProcess.init();

// tax/shipping/total are calculated once the user has entered a zip code
qs("#zip").addEventListener("blur", () => {
  checkoutProcess.calculateOrderTotal();
});

qs("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.target;
  if (!form.checkValidity()) {
    // let the browser show its normal "please fill this out" messaging
    form.reportValidity();
    return;
  }

  checkoutProcess
    .checkout(form)
    .then(() => {
      // success/failure UI handling is expanded in a later step —
      // for now, just confirm the order went through.
      alert("Thank you for your order!");
    })
    .catch((err) => {
      console.error("Checkout failed:", err);
      alert("Sorry, there was a problem placing your order. Please try again.");
    });
});
