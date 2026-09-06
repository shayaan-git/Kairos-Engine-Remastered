import React, { useState } from "react";
import { Link, replace, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/use.auth.js";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const user = useSelector((state) => state.auth.user);
   const loading = useSelector((state) => state.auth.loading);

   const { handleLogin } = useAuth();

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      await handleLogin({ email, password });
      navigate("/", { replace: true });
   };

   // prevent to go back to Login page if once logged in
   if (!loading && user) {
      return <Navigate to="/" replace />;
   }

   return (
      <div className="min-h-screen bg-linear-to-br bg-stone-900 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-stone-900 rounded-s-3xl p-8 border border-stone-400">
               {/* Header */}
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r text-stone-400 mb-2">
                     Welcome Back
                  </h1>
                  <p className="text-slate-400 text-sm">
                     Sign in to your account
                  </p>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                     <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                     >
                        Email Address
                     </label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition"
                     />
                  </div>

                  {/* Password Field */}
                  <div>
                     <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                     >
                        Password
                     </label>
                     <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                           setPassword(e.target.value);
                        }}
                        placeholder="Enter your password"
                        required
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition"
                     />
                  </div>

                  {/* Submit Button */}
                  <button
                     type="submit"
                     className="w-full py-3 bg-linear-to-r from-stone-200 to-stone-200 hover:from-stone-300 hover:to-stone-300 text-zinc-800 font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
                  >
                     Sign In
                  </button>
               </form>

               {/* Footer */}
               <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm">
                     Don't have an account?{" "}
                     <Link
                        to={"/register"}
                        className="text-gray-300 hover:text-gray-200 font-semibold"
                     >
                        Sign up
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
