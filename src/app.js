import express from 'express';
import hbs from "express-handlebars"
import allRoutes from "./routes/index.js";
import viewsRouter from "./routes/views.router.js";
import http from "http";
import { connectToDB } from "./config/db.js";
import { initSocket } from "./socket.js";
import { productManager } from './ProductManager.js';
import mongoose from 'mongoose';

const PORT = 3000;
const app = express();
const serverHttp = http.createServer(app)
const io = initSocket(serverHttp);

connectToDB();

app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.static(import.meta.dirname + "/public"));

//Routes
app.use("/api", allRoutes);
app.use("/", viewsRouter);

// Socket.io
io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.on('nuevoProducto', async producto => {
    await productManager.addProduct(producto, 0);
    const productosActualizados = await productManager.getProducts();
    console.log('nuevoProducto on')
    io.emit('productosActualizados', productosActualizados);
  });
});

serverHttp.listen(PORT, () => console.log(`Server running on port: ${PORT}`));