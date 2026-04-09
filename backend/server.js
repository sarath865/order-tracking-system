const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Make io available in routes
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/order-system")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

// Socket.io
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinOrder", (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined order room ${orderId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start Server
server.listen(8000, () => {
    console.log("Server running on port 8000");
});





