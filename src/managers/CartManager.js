import fs from "fs";
import ProductManager from "./ProductManager.js";
import path from "path";

class CartManager {
  static #path = path.resolve("src/data/carts.json");

  static async getCarts() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([]));
    }

    const data = await fs.promises.readFile(this.#path, "utf-8");
    return JSON.parse(data);
  }

  static async getData(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id == id) || null;
  }

  static async saveData(data) {
    await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));
  }

  static async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };

    carts.push(newCart);
    await this.saveData(carts);
    return newCart;
  }

  static async addProductToCart(cid, pid) {
    const carts = await this.getCarts();

    const cart = carts.find((c) => c.id == cid);
    if (!cart) return { error: "No se encontro carrito. Indique un carrito valido" };

    const product = await ProductManager.getProductById(pid);
    if (!product) return { error: "No se encontro el producto. Indique un producto valido" };

    const productInCart = cart.products.find((p) => p.productId == pid);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        productId: pid,
        quantity: 1,
      });
    }

    await this.saveData(carts);
    return cart;
  }
}

export default CartManager;
