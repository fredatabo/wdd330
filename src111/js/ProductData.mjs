function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// Base URL of the API server. Comes from the VITE_SERVER_URL variable
// defined in the .env file (see .env.sample) and is injected by Vite at
// build/dev time via import.meta.env.
const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  // No category/path here anymore -- the category is passed in per call so
  // one ProductData instance can be reused for any category or product.
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    // the API wraps the array of products in a "Result" property.
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
