const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create Order
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items are required" });
        }

        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }

            total += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity
            });
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: total,
            status: "Created"
        });

        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all orders for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product");

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single order by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status (Admin only)
router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Created",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;
        await order.save();

        const io = req.app.get("io");
        io.to(order._id.toString()).emit("orderUpdated", order);

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
