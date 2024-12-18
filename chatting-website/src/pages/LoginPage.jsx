import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleLogin = async () => {
    try {
      const loginData = {
        username,
        password,
      };
      const response = await axios.post(
        "http://localhost:8000/api/auth/user/login",
        loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (response.status === 200) {
        addNotification("Login successful!", "success");
        navigate("/"); // Redirect to home page
      } else {
        throw new Error("Unexpected response");
      }

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-300 grid place-content-center">
      <div className="w-60 bg-white p-2">
        <div className="w-full grid place-items-center">
          <div className="uppercase text-2xl font-bold">Login</div>
          <div className="w-12 h-1 mt-2 bg-slate-900"></div>
        </div>
        <div className="mt-2 p-4">
          <label className="text-slate-900">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-slate-200 mt-1 p-1 h-7 rounded-sm focus:outline-none  placeholder:text-sm"
            type="text"
            placeholder="Enter Username"
          />
        </div>
        <div className="p-4 mt-[-20px]">
          <label className="text-slate-900">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-200 mt-1 p-1 h-7 rounded-sm focus:outline-none placeholder:text-sm"
            type="password"
            placeholder="Enter Password"
          />
        </div>
        <div className="grid justify-center mt-3">
          <button
            onClick={handleLogin}
            className="bg-slate-900 text-white px-3 py-1 rounded-md"
          >
            Login
          </button>
          <div className="text-sm my-3">
            Don't have an account?{" "}
            <span className="text-sky-700 cursor-pointer hover:underline">
              <Link to={"/register"}>SignUp</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
