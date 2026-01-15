import { useState } from "react";
import { Mail, Lock, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SplitText from "./SplitText";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res.data.token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", res.data.token);
      navigate("/profile");

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[360px] text-center">

        <SplitText
          text="Welcome Back!!"
          className="text-2xl font-semibold text-gray-700 mb-8"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-11 pr-4 border rounded-full text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-11 border rounded-full text-sm"
              required
            />
            <EyeOff
              size={18}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#FADDC6] text-[#C47A4A] rounded-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-sm text-gray-400">- or -</div>

        <a
          href="http://localhost:3000/api/auth/google"
          onClick={() => localStorage.clear()}
          className="flex items-center justify-center gap-3 w-full h-12 border rounded-full"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </a>




        <p className="text-sm text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-[#C47A4A] font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
