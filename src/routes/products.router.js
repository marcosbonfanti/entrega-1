import { Router } from "express";
import { productManager } from '../ProductManager.js';
import { getIO } from "../socket.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

productsRouter.post('/', async (req, res) => {
  const product = req.body;
  await productManager.addProduct(product, 0);
  const io = getIO();
  
  const products = await productManager.getProducts();
  io.emit("productosActualizados", products);
  res.status(201).json({ message: 'Producto agregado correctamente' });
});

productsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.getProductById(id);
  if(!product){
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    res.json(product)
  }
});

productsRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const productDeleted = await productManager.deleteProductById(id);
  if(!productDeleted){
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    res.json(productDeleted)
  }
});

productsRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = req.body;
  const productUpdated = await productManager.updateProductById(id, product);
  if (!productUpdated) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json({ message: 'Producto actualizado correctamente' });
});

export default productsRouter;
