import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load orders");
    }
  };

  return (
    <div className="page-container">
      <h2>My Orders</h2>
      <p>{message}</p>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>

             <Link to={`/track/${order._id}`} className="track-link">
  Track Package
</Link>
          </div>
        ))
      )}
    </div>
  );
}