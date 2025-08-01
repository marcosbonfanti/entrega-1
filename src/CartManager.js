import cartModel from "./models/carts.model.js";
import productModel from "./models/products.model.js";

export default class CartManager {
  async createCart() {
    const newCart = await cartModel.create({ products: [] });
    console.log(`Cart created ID: ${newCart._id}`);
    return newCart;
  }

  async getCarts() {
    return await cartModel.find().populate("products.product");
  }

  async getCartById(id) {
    return await cartModel.findById(id).populate("products.product");
  }

  async addProductToCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.log(`Cart: ${cartId} not found`);
      return null;
    }

    const product = await productModel.findById(productId);
    if (!product) {
      console.log(`Product: ${productId} not found`);
      return null;
    }

    const item = cart.products.find(p => p.product.toString() === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    console.log(`✅ Producto ${productId} agregado al carrito ${cartId}`);
    return cart;
  }
}

export const cartManager = new CartManager();
