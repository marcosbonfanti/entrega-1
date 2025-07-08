import express from 'express';
import hbs from "express-handlebars"
import allRoutes from "./routes/index.js";
import viewsRouter from "./routes/views.router.js";

const PORT = 3000;
const app = express();

app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/api", allRoutes);
app.use("/", viewsRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`))