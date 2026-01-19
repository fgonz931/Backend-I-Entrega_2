import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await CartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getData(Number(req.params.cid));

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await CartManager.addProductToCart(
            Number(req.params.cid),
            Number(req.params.pid)
        );

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;