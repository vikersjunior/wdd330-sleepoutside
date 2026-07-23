import { alertMessage, setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (this.product?.Images?.PrimaryMedium && !this.product.Image) {
      this.product.Image = this.product.Images.PrimaryMedium;
    }
    this.renderProductDetails("main");
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }
    this.product.Image =
      this.product.Image ||
      this.product.Images?.PrimaryMedium ||
      this.product.Images?.PrimaryLarge;
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);
    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + 1;
    } else {
      this.product.Quantity = 1;
      cartItems.push(this.product);
    }
    setLocalStorage("so-cart", cartItems);
    alertMessage(
      `${this.product.NameWithoutBrand} was added to your cart.`,
      false,
    );
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    const brand = this.product.Brand?.Name || "";
    const color = this.product.Colors?.[0]?.ColorName || "";
    const description = this.product.DescriptionHtmlSimple || "";
    element.innerHTML = `
      <section class="product-detail">
        <h3>${brand}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${this.product.Images?.PrimaryLarge || this.product.Image}"
          alt="${this.product.NameWithoutBrand}"
        />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product__color">${color}</p>
        <p class="product__description">
          ${description}
        </p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
  }
}
