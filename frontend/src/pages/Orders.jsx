import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statuses = ["Created", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      setMessage("Failed to load orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      setMessage("Failed to update status");
    }
  };

  return (
    <div style={{ color: "black" }}>
      <h2>My Orders</h2>
      <p>{message}</p>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <p><strong>ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <Link to={`/track/${order._id}`}>Track</Link>

          {role === "admin" && (
            <div style={{ marginTop: "10px" }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order._id, s)}
                  style={{ marginRight: "6px" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}