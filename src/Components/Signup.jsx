import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import backgroundImage from "../assets/backgroundsignup.jpg";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCard(true), 200);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Save user info in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      alert(`Welcome ${name}, your account is created! 🎉`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div
        style={{
          ...styles.card,
          opacity: showCard ? 1 : 0,
          transform: showCard ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s ease",
        }}
      >
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <p style={styles.text}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Inter', sans-serif",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.6)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    zIndex: 2,
  },
  title: { fontSize: "24px", fontWeight: "700", color: "white", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    background: "linear-gradient(135deg, #FF6B6B, #FF8E8E)",
    color: "white",
    marginTop: "10px",
  },
  error: { marginTop: "10px", color: "#FF6B6B", fontSize: "14px" },
  text: { marginTop: "20px", color: "rgba(255,255,255,0.9)", fontSize: "14px" },
  link: { color: "#4ECDC4", fontWeight: "700", textDecoration: "none" },
};
