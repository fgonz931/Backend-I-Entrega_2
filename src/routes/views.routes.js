import express from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  const products = await ProductManager.getData();
  res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await ProductManager.getData();
  res.render("realTimeProducts", { products });
});

export default viewsRouter;
