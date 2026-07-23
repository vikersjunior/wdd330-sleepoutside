import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, getLocalStorage } from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function errorMessages(error) {
  const value = error?.message ?? error;
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => errorMessages(item));
  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => errorMessages(item));
  }
  return ["We could not submit your order. Please try again."];
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemCount = this.list.reduce(
      (count, item) => count + (Number(item.Quantity) || 1),
      0,
    );
    this.itemTotal = this.list.reduce(
      (total, item) =>
        total + Number(item.FinalPrice) * (Number(item.Quantity) || 1),
      0,
    );

    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const itemCount = document.querySelector(
      `${this.outputSelector} #item-count`,
    );
    if (subtotal) subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
    if (itemCount)
      itemCount.textContent = `${this.itemCount} item${this.itemCount === 1 ? "" : "s"}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.itemCount
      ? 10 + Math.max(0, this.itemCount - 1) * 2
      : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (tax) tax.textContent = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.textContent = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: Number(item.Quantity) || 1,
    }));
  }

  async checkout(form) {
    try {
      const order = formDataToJSON(form);
      order.orderDate = new Date().toISOString();
      order.items = this.packageItems(this.list);
      order.orderTotal = this.orderTotal.toFixed(2);
      order.shipping = this.shipping;
      order.tax = this.tax.toFixed(2);

      const response = await this.externalServices.checkout(order);
      localStorage.removeItem(this.key);
      window.location.href = "./success.html";
      return response;
    } catch (error) {
      errorMessages(error).forEach((message, index) => {
        alertMessage(message, index === 0);
      });
      return null;
    }
  }
}
