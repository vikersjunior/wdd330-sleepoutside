import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
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
    // Flexible constructor: category, data source, and the target element
    // are all passed in so this class can be reused for any product category.
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;

    // If provided, only show products whose Id is in this array.
    this.allowedIds = allowedIds;

    // Store the loaded products.
    this.products = [];
  }

  async init() {
    // dataSource.getData() returns a Promise – await resolves it.
    let list = await this.dataSource.getData(this.category);
    if (this.allowedIds) {
      list = list.filter((item) => this.allowedIds.includes(item.Id));
    }

    this.renderList(list);
    this.displayProductCount(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  displayProductCount(list) {
    const counter = document.querySelector("#product-count");

    if (counter) {
      counter.textContent = `${list.length} Products Available`;
    }
  }
}