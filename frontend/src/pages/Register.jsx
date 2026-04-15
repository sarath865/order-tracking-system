import { useState } from "react";
import api from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", { email, password, role });
      setMessage(res.data.message || "Registration successful");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <p>{message}</p>
      </div>
    </div>
  );
}