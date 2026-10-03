import { renderListWithTemplate } from "./utils.mjs";

// Returns a "X% off" discount badge when a product's FinalPrice is lower
// than its SuggestedRetailPrice, or an empty string when there's no
// discount to show. Kept as its own function so the percentage math is
// easy to read/adjust on its own, separate from the card layout.
function discountBadge(product) {
  const original = product.SuggestedRetailPrice;
  const current = product.FinalPrice;

  if (!original || original <= current) {
    return "";
  }

  const percentOff = Math.round(((original - current) / original) * 100);
  return `<span class="product-card__discount">${percentOff}% off</span>`;
}

// Builds the markup for a single product card.
// Kept as one small function (instead of hand-written HTML in main.js)
// so the ProductList class only has to know "how to get a string of HTML
// for a product" — not the layout details of the card itself.
// NOTE: relative "../product_pages/..." path (not root-absolute) so it
// keeps working no matter what sub-path the site is deployed under.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      ${discountBadge(product)}
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
    // holds the last-fetched, unsorted-order list so sortList() has
    // something to sort without re-fetching from the API every time.
    this.list = [];
  }

  // async so we can await the promise returned by dataSource.getData()
  // instead of chaining .then() everywhere this class is used.
  async init() {
    const list = await this.dataSource.getData(this.category);
    this.list = list;
    this.renderList(this.list);

    // Reflect which category is being shown, e.g. "Top Products: Backpacks"
    const heading = document.querySelector(".products h2");
    if (heading && this.category) {
      heading.textContent = `Top Products: ${formatCategoryName(this.category)}`;
    }
  }

  // sortBy is one of: "name-asc", "name-desc", "price-asc", "price-desc".
  // Sorts a *copy* of the original fetched list and re-renders, so the
  // underlying data (this.list) always stays in its original order and
  // can be re-sorted a different way without another API call.
  sortList(sortBy) {
    const sorted = [...this.list];

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
      default:
        // no valid sort chosen -- fall back to the original fetch order
        break;
    }

    this.renderList(sorted);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
