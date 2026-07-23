import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
const form = document.querySelector("#checkout-form");
const zip = document.querySelector("#zip");
const message = document.querySelector("#checkout-message");

checkout.init();
zip.addEventListener("input", () => {
  if (zip.value.trim()) checkout.calculateOrderTotal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Submitting your order...";

  try {
    await checkout.checkout(form);
    message.textContent = "Your order was submitted successfully!";
    form.reset();
  } catch (error) {
    message.textContent = "We could not submit your order. Please try again.";
  }
});
