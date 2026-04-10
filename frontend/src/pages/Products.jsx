import { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setMessage("Failed to load products");
    }
  };

  const placeOrder = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await api.post(
        "/orders",
        {
          items: [
            {
              productId,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Order placed successfully. Order ID: ${res.data._id}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to place order");
    }
  };

  return (
    <div style={{ color: "black" }}>
      <h2>Products</h2>
      <p>{message}</p>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => placeOrder(product._id)}>Buy Now</button>
          </div>
        ))
      )}
    </div>
  );
}