// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHeart, FaEnvelope, FaLock } from "react-icons/fa";

import { auth } from "../firebase";               
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // 🔥 Get and store Firebase token
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);

    // 🔁 Redirect to dashboard
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="container">
      <h1><FaHeart className="icon" /> Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          <FaEnvelope className="input-icon" /> Email:
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          <FaLock className="input-icon" /> Password:
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">💖 Login</button>
        <button type="button" onClick={() => navigate("/register")}>
          ✨ Register
        </button>
      </form>
    </div>
  );
}

export default Login;
