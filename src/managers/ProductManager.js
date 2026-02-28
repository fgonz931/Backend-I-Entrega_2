import fs from "fs";
import path from "path";

class ProductManager {
  static #path = path.resolve("src/data/products.json");
  static async getData() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([]));
    }

    const data = await fs.promises.readFile(this.#path, "utf-8");
    return JSON.parse(data);
  }

  static async saveData(data) {
    await fs.promises.writeFile(this.#path, JSON.stringify(data));
  }

  static async getProductById(id) {
    const products = await this.getData();
    return products.find((p) => p.id == id) || null;
  }

  static async createProduct(productData) {
    const products = await this.getData();

    const newProduct = {
      id: products.length === 0 ? 1 : products[products.length - 1].id + 1,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: productData.status,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: productData.thumbnails || [],
    };

    products.push(newProduct);
    await this.saveData(products);

    return newProduct;
  }

  static async updateProduct(id, updates) {
    const products = await this.getData();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
    };

    await this.saveData(products);
    return products[index];
  }

  static async deleteProduct(id) {
    const products = await this.getData();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) return null;

    await this.saveData(filteredProducts);
    return filteredProducts;
  }
}

export default ProductManager;
