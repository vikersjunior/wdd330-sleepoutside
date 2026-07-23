function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  async getData(category) {
    const url = baseURL
      ? `${baseURL}products/search/${category}`
      : `/json/${category}.json`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    if (!baseURL) {
      const products = await this.getData("tents");
      return products.find((product) => product.Id === id);
    }

    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
