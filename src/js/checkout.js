import { alertMessage, loadHeaderFooter } from "./utils.mjs";
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
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const expiration = form.elements.expiration.value.trim();
  const expirationMatch = expiration.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  const now = new Date();
  const expirationDate = expirationMatch
    ? new Date(
        2000 + Number(expirationMatch[2]),
        Number(expirationMatch[1]),
        0,
        23,
        59,
        59,
      )
    : null;
  if (!expirationMatch || !expirationDate || expirationDate <= now) {
    alertMessage("Please enter a valid future expiration date.");
    return;
  }

  message.textContent = "Submitting your order...";

  try {
    const result = await checkout.checkout(form);
    if (!result) message.textContent = "Please correct the errors above.";
  } catch (error) {
    alertMessage("We could not submit your order. Please try again.");
    message.textContent = "";
  }
});
