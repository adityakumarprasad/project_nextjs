'use client'
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const session = useSession();
  console.log(session.data?.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log("Login successful:", result);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {/* Center Box */}
      <div className="w-1/3 bg-[#0f0f0f] border border-green-500 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin}>


          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg bg-black text-white border border-green-600 outline-none focus:border-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded-lg bg-black text-white border border-green-600 outline-none focus:border-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login button */}
          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-black font-bold rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Google sign-in */}
        <div className="mt-6 flex items-center justify-center">
          <button className="flex items-center gap-3 w-full p-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition" onClick={async () => {
            await signIn('google', { callbackUrl: "/" });
          }
          }>
            <FcGoogle size={26} />
            Sign in with Google
          </button>
        </div>

        {/* Already have account */}
        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
