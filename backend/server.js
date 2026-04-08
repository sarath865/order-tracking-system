const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products"); // ✅ ADD HERE

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes); // ✅ ADD HERE

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/order-system")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

// Start Server
app.listen(8000, () => {
    console.log("Server running on port 8000");
});



