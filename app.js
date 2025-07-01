import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager();

app.get('/', (req, res) => {
  res.send('¡Hola mundo con import!');
});


app.get('/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const product = req.body;
  await productManager.addProduct(product, 0);
  res.status(201).json({ message: 'Producto agregado correctamente' });
});

app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.getProductById(id);
  console.log(product)
  if(product.length === 0){
    res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product)
  } else {
    res.json(product)
  }
});

app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.deleteProductById(id);
  if(product.length === 0){
    res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product)
  } else {
    res.json(product)
  }
});


app.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = req.body;
  await productManager.updateProductById(id, product);
  res.status(201).json({ message: 'Producto actualizado correctamente' });
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
