import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { productManager } from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CartManager {
  constructor(filePath = "../carts.json") {
    this.path = path.resolve(__dirname, filePath);
  }

  async createCart() {
    const carts = await this.getCarts();
    let id;

    if (carts.length === 0) {
      id = 1;
    } else {
      id = Math.max(...carts.map(c => c.id)) + 1;
    }

    const cartObject = { id, products: [] };
    carts.push(cartObject);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    console.log(`🛒 Carrito creado con ID ${id}`);
    return cartObject;
  }

  async getCarts() {
    try {
      const json = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(json);
    } catch (error) {
      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id) || null;
  }

  async addProductToCart(cartId, productId) {
    const product = await productManager.getProductById(productId)
    if (!product) {
      return null;
    }

    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
      console.log(`❌ Carrito con ID ${cartId} no existe`);
      return null;
    }

    const cart = carts[cartIndex];
    const productInCart = cart.products.find(p => p.product === productId);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    console.log(`Producto con ID ${productId} agregado al carrito ${cartId}`);
    return cart;

  }
}

export const cartManager = new CartManager();
