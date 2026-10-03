import{s as o,r as n,l,a as d}from"./utils-DPPyhCZV.js";import{P as u}from"./ProductData-CnzLtmUG.js";function m(e){return`<li class="product-card">
    <a href="../product_pages/index.html?product=${e.Id}">
      <img
        src="${e.Images.PrimaryMedium}"
        alt="Image of the ${e.Name}"
      />
      <h3 class="card__brand">${e.Brand.Name}</h3>
      <h2 class="card__name">${e.NameWithoutBrand}</h2>
      <p class="product-card__price">$${e.FinalPrice}</p>
    </a>
    <button type="button" class="quick-view-btn" data-id="${e.Id}">
      Quick View
    </button>
  </li>`}function h(e){var t,i;const s=((i=(t=e.Colors)==null?void 0:t[0])==null?void 0:i.ColorName)??"",a=e.Images.PrimaryLarge??e.Images.PrimaryMedium;return`<button type="button" class="quick-view__close" aria-label="Close quick view">&times;</button>
    <h3 class="card__brand">${e.Brand.Name}</h3>
    <h2 id="quick-view-title">${e.NameWithoutBrand}</h2>
    <img src="${a}" alt="Image of the ${e.Name}" />
    <p class="product-card__price">$${e.FinalPrice}</p>
    ${s?`<p class="product__color">${s}</p>`:""}
    <p class="product__description">${e.DescriptionHtmlSimple??""}</p>
    <div class="quick-view__actions">
      <button type="button" class="quick-view__add" data-id="${e.Id}">Add to Cart</button>
      <a class="quick-view__details" href="../product_pages/index.html?product=${e.Id}">View Full Details</a>
    </div>`}function p(e){return e.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ")}class g{constructor(s,a,t){this.category=s,this.dataSource=a,this.listElement=t,this.list=[]}async init(){const s=await this.dataSource.getData(this.category);this.list=s,this.renderList(this.list),this.listElement.addEventListener("click",t=>{const i=t.target.closest(".quick-view-btn");i&&this.openQuickView(i.dataset.id)});const a=document.querySelector(".products h2");a&&this.category&&(a.textContent=`Top Products: ${p(this.category)}`)}sortList(s){const a=[...this.list];switch(s){case"name-asc":a.sort((t,i)=>t.Name.localeCompare(i.Name));break;case"name-desc":a.sort((t,i)=>i.Name.localeCompare(t.Name));break;case"price-asc":a.sort((t,i)=>t.FinalPrice-i.FinalPrice);break;case"price-desc":a.sort((t,i)=>i.FinalPrice-t.FinalPrice);break}this.renderList(a)}openQuickView(s){const a=this.list.find(i=>String(i.Id)===String(s));if(!a)return;let t=document.querySelector("#quick-view-modal");t||(t=document.createElement("dialog"),t.id="quick-view-modal",t.className="quick-view",t.setAttribute("aria-labelledby","quick-view-title"),document.body.appendChild(t),t.addEventListener("click",i=>{(i.target===t||i.target.closest(".quick-view__close"))&&t.close();const c=i.target.closest(".quick-view__add");c&&(o("so-cart",this.currentQuickViewProduct),c.textContent="Added!")})),this.currentQuickViewProduct=a,t.innerHTML=h(a),t.showModal()}renderList(s){n(m,this.listElement,s)}}l();const _=d("category"),k=new u,w=document.querySelector(".product-list"),r=new g(_,k,w);r.init();const b=document.querySelector("#sort");b.addEventListener("change",e=>{r.sortList(e.target.value)});
