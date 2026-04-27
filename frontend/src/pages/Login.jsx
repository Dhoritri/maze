import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const inputCls =
  "w-full bg-transparent border border-white/10 text-white text-sm py-3 px-4 placeholder:text-neutral-700 focus:border-white/30 focus:outline-none transition-colors";

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
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
    },
    onError: () => toast.error("Google sign-in failed"),
  });

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

        {/* Google button */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center gap-3 border border-white/10 py-3 text-sm text-neutral-400 hover:text-white hover:border-white/25 transition-colors mb-6"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-[10px] tracking-[0.15em] text-neutral-700">OR</span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

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

          {/* Links */}
          <div className="flex justify-between items-center mt-1">
            {mode === "Login" ? (
              <>
                <button
                  type="button"
                  className="text-[11px] text-neutral-600 hover:text-white transition-colors"
                >
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
