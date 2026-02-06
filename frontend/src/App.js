import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [idea, setIdea] = useState("");
  const [output, setOutput] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [action, setAction] = useState("generate");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);

  // AUTH STATES
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOAD USER SESSION
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Typing animation
  useEffect(() => {
    let i = 0;
    setDisplayText("");
    if (!output) return;

    const interval = setInterval(() => {
      setDisplayText((prev) => prev + output.charAt(i));
      i++;
      if (i >= output.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [output]);

  // CONTENT GENERATION
  const generate = async () => {
    setLoading(true);
    setOutput("");

    const res = await fetch("http://127.0.0.1:8000/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, platform, action })
    });

    const data = await res.json();
    setOutput(data.result || "No response");
    setLoading(false);
  };

  // LOGIN
  const login = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setShowLogin(false);
      setEmail("");
      setPassword("");
    }
  };

  // SIGNUP (same backend for now)
  const signup = async () => {
    // For now signup behaves same as login
    await login();
    setShowSignup(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className={dark ? "app dark" : "app light"}>
      {/* NAVBAR */}
      <div className="navbar">
        <h2>KiroWrite ✨</h2>
        <div>
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <span className="username">👤 {user.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="auth" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button
                className="auth outline"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="card">
        <h1>AI Content Generator</h1>
        <p>Create powerful content in seconds 🚀</p>

        <textarea
          placeholder="Enter your idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <div className="row">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>Blog</option>
          </select>

          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="generate">Generate</option>
            <option value="rewrite">Rewrite</option>
            <option value="summarize">Summarize</option>
          </select>
        </div>

        <button className="generate" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate ✨"}
        </button>

        {displayText && (
          <div className="output">
            <pre>{displayText}</pre>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="auth-page">
          <div className="auth-card">
            <h2>Login</h2>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="generate" onClick={login}>
              Login
            </button>

            <p>
              Don’t have an account?{" "}
              <span
                className="link"
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              >
                Sign Up
              </span>
            </p>

            <button onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="auth-page">
          <div className="auth-card">
            <h2>Sign Up</h2>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="generate" onClick={signup}>
              Create Account
            </button>

            <p>
              Already have an account?{" "}
              <span
                className="link"
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              >
                Login
              </span>
            </p>

            <button onClick={() => setShowSignup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
