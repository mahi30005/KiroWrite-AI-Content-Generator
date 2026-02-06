import { Link } from "react-router-dom";

export default function Navbar({ dark, setDark }) {
  return (
    <div className="navbar">
      <h2>KiroWrite ✨</h2>

      <div>
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <Link to="/login" className="auth">
          Login
        </Link>

        <Link to="/signup" className="auth outline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
