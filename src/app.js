import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
app.use(express.static("public"));
const io = new Server(server);
app.use(express.json());
//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

io.on("connection", async (socket) => {
  const products = await ProductManager.getData();
  socket.emit("productsUpdated", products);

  socket.on("newProduct", async (productData) => {
    console.log("Nuevo producto recibido:", productData);
    await ProductManager.createProduct(productData);
    const updatedProducts = await ProductManager.getData();
    io.emit("productsUpdated", updatedProducts);
  });

  socket.on("deleteProduct", async (productId) => {
    await ProductManager.deleteProduct(Number(productId));
    const updatedProducts = await ProductManager.getData();
    io.emit("productsUpdated", updatedProducts);
  });
});

const PORT = process.env.PORT || 8080;

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

server.listen(PORT, () =>
  console.log(`Servidor levantado en el puerto ${PORT}`),
);
