import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import Product from "./models/products.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {

  constructor(filePath = '../products.json') {
    this.path = path.resolve(__dirname, filePath);
  }

  async addProduct(productObject, idPredefined) {
    const { title, description, price, thumbnail, code, stock } = productObject;
    const product = new Product({ title, description, price, thumbnail, code, stock });
    const savedProduct = await product.save();
    console.log("Product added");
    return savedProduct;
  }

  async getProducts() {
    return await Product.find().lean();
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      return product || null;
    } catch (err) {
      return null;
    }
  }

  async deleteProductById(id) {
    try {
      const deleted = await Product.findByIdAndDelete(id);
      return deleted || null;
    } catch (err) {
      return null;
    }
  }


  async updateProductById(id, productObject) {
    try {
      const updated = await Product.findByIdAndUpdate(id, productObject, { new: true });
      return updated || null;
    } catch (err) {
      return null;
    }
  }

}

export const productManager = new ProductManager();