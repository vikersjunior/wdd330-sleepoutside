import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  let discount = "";

  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const percentage = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
        100,
    );
    discount = `<span class="discount-badge">${percentage}% OFF</span>`;
  }

  return `<li class="product-card">
    ${discount}
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images?.PrimaryMedium || product.Image}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement, allowedIds = null) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.allowedIds = allowedIds;
    this.products = [];
  }

  async init() {
    let list = await this.dataSource.getData(this.category);
    if (this.allowedIds) {
      list = list.filter((item) => this.allowedIds.includes(item.Id));
    }

    this.products = list;
    this.renderList(this.products);
    this.displayProductCount(this.products);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }

  sortList(sortBy) {
    const sorted = [...this.products];

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) =>
          a.NameWithoutBrand.localeCompare(b.NameWithoutBrand),
        );
        break;
      case "name-desc":
        sorted.sort((a, b) =>
          b.NameWithoutBrand.localeCompare(a.NameWithoutBrand),
        );
        break;
      case "price-asc":
        sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
      default:
        break;
    }

    this.renderList(sorted);
  }

  displayProductCount(list) {
    const counter = document.querySelector("#product-count");
    if (counter) {
      counter.textContent = `${list.length} Products Available`;
    }
  }
}
