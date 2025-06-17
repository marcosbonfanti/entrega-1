import fs from "fs";

export default class ProductManager {

  constructor(path = './products.json') {
    this.path = path;
  }

  async addProduct(productObject) {
    const { title, description, price, thumbnail, code, stock } = productObject;
    const products = await this.getProducts();
    let id;
    if(products.length === 0) {
      id = 0;
    } else {
      id = products[products.length -1].id +=1
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
    console.log(productFound)
    if (productFound.length === 1) {
      return productFound[0];
    } else {
      return [];
    }
  }  
}

export const productManager = new ProductManager();