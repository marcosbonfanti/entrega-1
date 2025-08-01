import { Router } from "express";
import { productManager } from '../ProductManager.js';
import Product from '../models/products.model.js';
import { getIO } from "../socket.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const filter = {};

    if (query) {
      if (query === 'disponible') {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }
    
    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parsedLimit);
    const skip = (parsedPage - 1) * parsedLimit;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const hasPrevPage = parsedPage > 1;
    const hasNextPage = parsedPage < totalPages;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? parsedPage - 1 : null,
      nextPage: hasNextPage ? parsedPage + 1 : null,
      page: parsedPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${baseUrl}?page=${parsedPage - 1}&limit=${parsedLimit}` : null,
      nextLink: hasNextPage ? `${baseUrl}?page=${parsedPage + 1}&limit=${parsedLimit}` : null
    });        
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
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
