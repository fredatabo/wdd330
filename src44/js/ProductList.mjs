import { renderListWithTemplate, setLocalStorage } from "./utils.mjs";

// Builds the markup for a single product card.
// Kept as one small function (instead of hand-written HTML in main.js)
// so the ProductList class only has to know "how to get a string of HTML
// for a product" — not the layout details of the card itself.
// NOTE: relative "../product_pages/..." path (not root-absolute) so it
// keeps working no matter what sub-path the site is deployed under.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="Image of the ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
    <button type="button" class="quick-view-btn" data-id="${product.Id}">
      Quick View
    </button>
  </li>`;
}

// Builds the markup that goes inside the quick view modal.
function quickViewTemplate(product) {
  const colorName = product.Colors?.[0]?.ColorName ?? "";
  const image = product.Images.PrimaryLarge ?? product.Images.PrimaryMedium;
  return `<button type="button" class="quick-view__close" aria-label="Close quick view">&times;</button>
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 id="quick-view-title">${product.NameWithoutBrand}</h2>
    <img src="${image}" alt="Image of the ${product.Name}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    ${colorName ? `<p class="product__color">${colorName}</p>` : ""}
    <p class="product__description">${product.DescriptionHtmlSimple ?? ""}</p>
    <div class="quick-view__actions">
      <button type="button" class="quick-view__add" data-id="${product.Id}">Add to Cart</button>
      <a class="quick-view__details" href="../product_pages/index.html?product=${product.Id}">View Full Details</a>
    </div>`;
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

    // one delegated listener on the <ul> keeps working after every re-render
    // (e.g. when the list is re-sorted), so it only needs to be added once.
    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest(".quick-view-btn");
      if (button) {
        this.openQuickView(button.dataset.id);
      }
    });

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

  // Opens a modal with the details of the product that matches `id`.
  // Uses the list that was already fetched, so no extra API call is needed.
  openQuickView(id) {
    const product = this.list.find((item) => String(item.Id) === String(id));
    if (!product) return;

    // reuse a single <dialog> element for every quick view
    let modal = document.querySelector("#quick-view-modal");
    if (!modal) {
      modal = document.createElement("dialog");
      modal.id = "quick-view-modal";
      modal.className = "quick-view";
      modal.setAttribute("aria-labelledby", "quick-view-title");
      document.body.appendChild(modal);

      modal.addEventListener("click", (event) => {
        // click on the dark backdrop (the dialog itself) or the X closes it
        if (event.target === modal || event.target.closest(".quick-view__close")) {
          modal.close();
        }
        const addButton = event.target.closest(".quick-view__add");
        if (addButton) {
          setLocalStorage("so-cart", this.currentQuickViewProduct);
          addButton.textContent = "Added!";
        }
      });
    }

    this.currentQuickViewProduct = product;
    modal.innerHTML = quickViewTemplate(product);
    modal.showModal();
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
