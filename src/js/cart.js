import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
  attachQuantityListeners();
}

function cartItemTemplate(item) {
  const quantity = item.Quantity || 1;
  return `<li class="cart-card divider" data-id="${item.Id}">
  <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity">
    <label for="qty-${item.Id}">qty:</label>
    <button type="button" class="qty-decrease" data-id="${item.Id}" aria-label="Decrease quantity">-</button>
    <input
      type="number"
      id="qty-${item.Id}"
      class="qty-input"
      data-id="${item.Id}"
      min="1"
      value="${quantity}"
    />
    <button type="button" class="qty-increase" data-id="${item.Id}" aria-label="Increase quantity">+</button>
  </div>
  <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
</li>`;
}

function renderCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
    0,
  );
  let totalElement = document.querySelector(".cart-total");
  if (!totalElement) {
    totalElement = document.createElement("p");
    totalElement.className = "cart-total";
    document.querySelector(".products").appendChild(totalElement);
  }
  totalElement.textContent = cartItems.length
    ? `Total: $${total.toFixed(2)}`
    : "";
}

function updateQuantity(id, newQuantity) {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  const item = cartItems.find((product) => product.Id === id);
  if (!item) return;

  const sanitizedQuantity = Math.max(1, Number(newQuantity) || 1);
  item.Quantity = sanitizedQuantity;

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function attachQuantityListeners() {
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      updateQuantity(e.target.dataset.id, e.target.value);
    });
  });

  document.querySelectorAll(".qty-decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const input = document.getElementById(`qty-${id}`);
      updateQuantity(id, Number(input.value) - 1);
    });
  });

  document.querySelectorAll(".qty-increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const input = document.getElementById(`qty-${id}`);
      updateQuantity(id, Number(input.value) + 1);
    });
  });
}

renderCartContents();
