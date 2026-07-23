import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ExternalServices("tents");

const product = new ProductDetails(productId, dataSource);

loadHeaderFooter();
product.init();
