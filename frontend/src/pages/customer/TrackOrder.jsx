import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const foundOrder = res.data.find((o) => o._id === id);

      if (!foundOrder) {
        setMessage("Order not found");
      } else {
        setOrder(foundOrder);
      }
    } catch (err) {
      setMessage("Error loading order");
    }
  };

  return (
    <div className="page-container">
      <h2>Track Order</h2>

      {message && <p>{message}</p>}

      {order && (
        <div className="track-card">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <div className="tracking-bar">
            <div className={`step ${order.status !== "Created" ? "active" : ""}`}>Created</div>
            <div className={`step ${["Confirmed","Processing","Shipped","Delivered"].includes(order.status) ? "active" : ""}`}>Confirmed</div>
            <div className={`step ${["Processing","Shipped","Delivered"].includes(order.status) ? "active" : ""}`}>Processing</div>
            <div className={`step ${["Shipped","Delivered"].includes(order.status) ? "active" : ""}`}>Shipped</div>
            <div className={`step ${order.status === "Delivered" ? "active" : ""}`}>Delivered</div>
          </div>
        </div>
      )}
    </div>
  );
}