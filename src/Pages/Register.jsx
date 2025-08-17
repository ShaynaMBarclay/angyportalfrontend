
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaStar } from "react-icons/fa";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ScrollingBanner from "../Components/ScrollingBanner"; 

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      alert("Registration successful. Please log in.");
      navigate("/");
      } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      setError("Email already in use. Please use a different email.");
    } else {
      setError(err.message);
    }
  }
};

  return (
   <>
    <ScrollingBanner />
    <div className="container">
      <h2><FaStar className="icon" /> Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">🌷 Register</button>

          <button
        type="button"
        onClick={() => navigate("/")}
      >
        🔑 Login
      </button>
      </form>
    </div>
    </>
  );
}

export default Register;
