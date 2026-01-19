import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        const products = await ProductManager.getData();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(
            Number(req.params.id)
        );

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.post("/", async (req, res) => {
    try {
        const newProduct = await ProductManager.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await ProductManager.updateProduct(
            Number(req.params.id),
            req.body
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;