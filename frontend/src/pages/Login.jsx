import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import GoogleLoginButton from "../components/GoogleLoginButton";

const inputCls =
  "w-full bg-transparent border border-white/10 text-white text-sm py-3 px-4 placeholder:text-neutral-700 focus:border-white/30 focus:outline-none transition-colors";

const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const [mode, setMode] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (mode === "Sign Up") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const { data } = await axios.post(backendUrl + "/api/user/register", { name, email, password });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/google", {
        access_token: tokenResponse.access_token,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const switchMode = (m) => {
    setMode(m);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">
            {mode === "Login" ? "Welcome Back" : "Create Account"}
          </p>
          <h1 className="prata-regular text-3xl text-white">
            {mode === "Login" ? "Sign In" : "Sign Up"}
          </h1>
        </div>

        {/* Google button — only shown when VITE_GOOGLE_CLIENT_ID is configured */}
        {hasGoogle && (
          <>
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed")}
            />
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-[10px] tracking-[0.15em] text-neutral-700">OR</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3">
          {mode === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputCls}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputCls}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputCls}
          />
          {mode === "Sign Up" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputCls}
            />
          )}

          <div className="flex justify-between items-center mt-1">
            {mode === "Login" ? (
              <>
                <button type="button" className="text-[11px] text-neutral-600 hover:text-white transition-colors">
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("Sign Up")}
                  className="text-[11px] text-neutral-500 hover:text-white transition-colors"
                >
                  Create account →
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => switchMode("Login")}
                className="text-[11px] text-neutral-500 hover:text-white transition-colors ml-auto"
              >
                Already have an account? Sign in →
              </button>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-white text-black py-3.5 text-[11px] tracking-[0.2em] font-medium hover:bg-[#FAB29E] transition-colors"
          >
            {mode === "Login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
