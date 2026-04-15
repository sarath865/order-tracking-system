import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Shop from "./pages/customer/Shop";
import Cart from "./pages/customer/Cart";
import MyOrders from "./pages/customer/MyOrders";
import TrackOrder from "./pages/customer/TrackOrder";

import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";

function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">OrderMart</div>

      <div className="nav-links">
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/my-orders">My Orders</Link>
        <Link to="/register">Register</Link>

        {role === "admin" && (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <Link to="/admin/products">Manage Products</Link>
            <Link to="/admin/orders">Manage Orders</Link>
          </>
        )}

        <Link to="/login">Login</Link>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/track/:id" element={<TrackOrder />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}
