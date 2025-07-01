import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {

  constructor(filePath = '../products.json') {
    this.path = path.resolve(__dirname, filePath);
  }

  async addProduct(productObject, idPredefined) {
    const { title, description, price, thumbnail, code, stock } = productObject;
    const products = await this.getProducts();
    let id;
    if(products.length === 0) {
      id = 1
    } else if (idPredefined === 0 ) {
      id = Math.max(...products.map(p => p.id)) + 1;
    } else {
      id = idPredefined;
    }
    products.push({id, title, description, price, thumbnail, code, stock})
    const json = JSON.stringify(products, null, 2)
    await fs.promises.writeFile(this.path, json);
    console.log("Product added")
  }

  async getProducts() {
    try {
      const json = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(json);
    } catch (error) {
      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const productFound = products.filter(product => product.id === id);
    if (productFound.length === 1) {
      return productFound[0];
    } else {
      return [];
    }
  }

  async deleteProductById(id) {
    const products = await this.getProducts();
    const productFound = products.filter(product => product.id === id);
    if (productFound.length === 1) {
      const productsDeleted = products.filter(product => product.id !== id);
      const json = JSON.stringify(productsDeleted, null, 2);
      await fs.promises.writeFile(this.path, json);
      return productFound[0];
    } else {
      return null;
    }
  }


  async updateProductById(id, productObject) {
    const productDeleted = await this.deleteProductById(id)
    if(productDeleted) {
      await productManager.addProduct(productObject, id);
      return { ...productObject, id };
    } else {
      return null;
    }
  }

}

export const productManager = new ProductManager();