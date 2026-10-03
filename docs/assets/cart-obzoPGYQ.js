import{g as o,r as l,q as c,l as i}from"./utils-DPPyhCZV.js";function d(r){var e,n,s;const t=((n=(e=r.Colors)==null?void 0:e[0])==null?void 0:n.ColorName)??"",a=((s=r.Images)==null?void 0:s.PrimaryMedium)??r.Image;return`<li class="cart-card divider">
  <a href="../product_pages/index.html?product=${r.Id}" class="cart-card__image">
    <img
      src="${a}"
      alt="${r.Name}"
    />
  </a>
  <a href="../product_pages/index.html?product=${r.Id}">
    <h2 class="card__name">${r.Name}</h2>
  </a>
  <p class="cart-card__color">${t}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${r.FinalPrice}</p>
</li>`}class p{constructor(t,a){this.key=t,this.parentElement=a}init(){this.renderCartContents()}renderCartContents(){const t=o(this.key)||[];if(t.length===0){this.parentElement.innerHTML='<li class="cart-empty">Your cart is empty.</li>',this.renderCartTotal(t);return}l(d,this.parentElement,t),this.renderCartTotal(t)}renderCartTotal(t){const a=c(".cart-total");if(!a)return;if(!Array.isArray(t)||t.length===0){a.textContent="";return}const e=t.reduce((n,s)=>n+s.FinalPrice,0);a.textContent=`Total: $${e.toFixed(2)}`}}i();const h=new p("so-cart",c(".product-list"));h.init();
