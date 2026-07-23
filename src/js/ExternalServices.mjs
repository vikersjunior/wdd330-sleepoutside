function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Request failed: ${res.status}`);
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  getData() {
    return fetch(this.path).then(convertToJson);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    return fetch("https://wdd330-backend.onrender.com/checkout", options).then(
      convertToJson,
    );
  }
}
