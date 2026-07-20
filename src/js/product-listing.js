import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

function formatCategory(categoryName) {
  return categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const titleElement = document.querySelector("#listing-title");

if (titleElement) {
  titleElement.textContent = `Top Products: ${formatCategory(category)}`;
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();
