import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Int16Array,
  thumbnail: String,
  code: String,
  stock: Int16Array
})

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;