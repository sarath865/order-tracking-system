import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      const res = await api.post(
        "/orders",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("cart");
      setCart([]);
      setMessage(`Order placed successfully. Order ID: ${res.data._id}`);
      navigate("/my-orders");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to place order");
    }
  };

  return (
    <div className="page-container">
      <h2>My Cart</h2>
      <p>{message}</p>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-card" key={item._id}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="bill-card">
            <h3>Total Bill: ₹{total}</h3>
            <button onClick={placeOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}