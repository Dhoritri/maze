import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/user/admin", { email, password });
      if (data.success) {
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-full max-w-sm px-4">

        <div className="flex flex-col items-center mb-10">
          <img src={assets.logo} className="w-24 mb-6 opacity-90" alt="Maze" />
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-2">Admin Portal</p>
          <h1 className="prata-regular text-2xl text-white">Sign In</h1>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border border-white/10 text-white text-sm py-3 px-4 placeholder:text-neutral-700 focus:border-white/30 focus:outline-none transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent border border-white/10 text-white text-sm py-3 px-4 placeholder:text-neutral-700 focus:border-white/30 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="mt-2 bg-white text-black py-3 text-[11px] tracking-[0.2em] font-medium hover:bg-[#FAB29E] transition-colors"
          >
            ACCESS DASHBOARD
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
