import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Only show products that have a product detail page
const allowedIds = ["880RR", "985RF", "985PR", "344YJ"];

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement, allowedIds);
productList.init();
