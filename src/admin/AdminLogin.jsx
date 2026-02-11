import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "./AuthProvider.jsx";

export default function AdminLogin() {
  const { user, signIn, resetPassword, authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter your admin email to reset password.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Password reset email sent.");
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="glass-card p-8">
        <p className="eyebrow">Admin Access</p>
        <h1 className="mt-3 font-display text-3xl">Sign in to TENZI Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Secure access for product management and wholesale catalog updates.
        </p>
        {(error || authError) && (
          <div className="mt-4 rounded-2xl border border-danger/50 bg-danger/10 p-3 text-sm text-danger">
            {error || authError}
          </div>
        )}
        {message && (
          <div className="mt-4 rounded-2xl border border-success/40 bg-success/10 p-3 text-sm text-success">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted">Email</label>
            <input
              className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted">Password</label>
            <input
              className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 text-xs uppercase tracking-[0.3em] text-charcoal hover:text-primary"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
