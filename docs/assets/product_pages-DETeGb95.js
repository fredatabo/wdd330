import{q as e,s as o,b as i,l as s,a as c}from"./utils-DPPyhCZV.js";import{P as n}from"./ProductData-xT122wIH.js";function l(t){var d,r;const a=((r=(d=t.Colors)==null?void 0:d[0])==null?void 0:r.ColorName)??"";return`<h3>${t.Brand.Name}</h3>

    <h2 class="divider">${t.NameWithoutBrand}</h2>

    <img
      class="divider"
      src="${t.Images.PrimaryLarge}"
      alt="${t.Name}"
    />

    <p class="product-card__price">$${t.FinalPrice}</p>

    <p class="product__color">${a}</p>

    <p class="product__description">
      ${t.DescriptionHtmlSimple??""}
    </p>

    <div class="product-detail__add">
      <button id="addToCart" data-id="${t.Id}">Add to Cart</button>
    </div>`}class u{constructor(a,d){this.productId=a,this.product={},this.dataSource=d}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails(),document.getElementById("addToCart").addEventListener("click",this.addProductToCart.bind(this));const a=e("title");a&&(a.textContent=`Sleep Outside | ${this.product.Name}`)}addProductToCart(){o("so-cart",this.product)}renderProductDetails(){i(l(this.product),e(".product-detail"))}}s();const p=new n,m=c("product"),h=new u(m,p);h.init();
