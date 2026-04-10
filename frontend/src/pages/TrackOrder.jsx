import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api";

const statusSteps = ["Created", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrder();

    const socket = io("http://localhost:8000");

    socket.emit("joinOrder", id);

    socket.on("orderUpdated", (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to fetch order");
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div style={{ color: "black" }}>
      <h2>Track Order</h2>
      <p>{message}</p>

      {order && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <h3>Progress</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {statusSteps.map((step, index) => (
              <div
                key={step}
                style={{
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid #999",
                  backgroundColor: index <= currentStepIndex ? "#90ee90" : "#eee",
                  fontWeight: index <= currentStepIndex ? "bold" : "normal",
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}