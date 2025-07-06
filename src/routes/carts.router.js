import { Router } from "express";
import { cartManager } from '../CartManager.js';

const cartsRouter = Router();


cartsRouter.post('/', async (req, res) => {
  await cartManager.createCart();
  res.status(201).json({ message: 'Carrito creado correctamente' });
});


cartsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const cart = await cartManager.getCartById(id);
  if (!cart) {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else {
    res.json(cart);
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const cart = await cartManager.addProductToCart(cartId, productId);
  if (!cart) {
    res.status(404).json({ message: 'Carrito o producto no encontrado' });
  } else {
    res.json(cart);
  }
});

export default cartsRouter;