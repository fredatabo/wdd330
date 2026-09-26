import{r as c,l as o,a as n}from"./utils-Ctj1Vdfx.js";import{P as l}from"./ProductData-DGs32yhV.js";function m(t){return`<li class="product-card">
    <a href="../product_pages/index.html?product=${t.Id}">
      <img
        src="${t.Images.PrimaryMedium}"
        alt="Image of the ${t.Name}"
      />
      <h3 class="card__brand">${t.Brand.Name}</h3>
      <h2 class="card__name">${t.NameWithoutBrand}</h2>
      <p class="product-card__price">$${t.FinalPrice}</p>
    </a>
  </li>`}function d(t){return t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}class h{constructor(e,a,r){this.category=e,this.dataSource=a,this.listElement=r,this.list=[]}async init(){const e=await this.dataSource.getData(this.category);this.list=e,this.renderList(this.list);const a=document.querySelector(".products h2");a&&this.category&&(a.textContent=`Top Products: ${d(this.category)}`)}sortList(e){const a=[...this.list];switch(e){case"name-asc":a.sort((r,s)=>r.Name.localeCompare(s.Name));break;case"name-desc":a.sort((r,s)=>s.Name.localeCompare(r.Name));break;case"price-asc":a.sort((r,s)=>r.FinalPrice-s.FinalPrice);break;case"price-desc":a.sort((r,s)=>s.FinalPrice-r.FinalPrice);break}this.renderList(a)}renderList(e){c(m,this.listElement,e)}}o();const u=n("category"),p=new l,g=document.querySelector(".product-list"),i=new h(u,p,g);i.init();const y=document.querySelector("#sort");y.addEventListener("change",t=>{i.sortList(t.target.value)});
