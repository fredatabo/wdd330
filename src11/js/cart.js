import { loadHeaderFooter, qs } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const cart = new ShoppingCart("so-cart", qs(".product-list"));
cart.init();
