import { useEffect, useState } from "react";
import api from "../../api";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      const updatedProducts = res.data.map((product) => ({
        ...product,
        quantity: 1,
      }));

      setProducts(updatedProducts);
    } catch {
      setMessage("Failed to load products");
    }
  };

  const updateQuantity = (id, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === id
          ? { ...product, quantity: Math.max(1, Number(value)) }
          : product
      )
    );
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage(`${product.name} added to cart`);
  };

  return (
    <div className="page-container">
      <h2>Shop Products</h2>
      <p>{message}</p>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            <p>Stock: {product.stock}</p>

            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => updateQuantity(product._id, e.target.value)}
            />

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}