import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Order Tracking System</h1>

      <nav style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track/:id" element={<TrackOrder />} />
      </Routes>
    </div>
  );
}
