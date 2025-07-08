import { Router } from "express";

import { productManager } from '../ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error("Error cargando productos:", error);
    res.status(500).send("Error interno");
  }
});

export default router;