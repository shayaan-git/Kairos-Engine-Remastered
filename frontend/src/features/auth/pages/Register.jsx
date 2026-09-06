import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      const payLoad = { username, email, password };
   };

   return (
      <div className="min-h-screen bg-gradient-to-br bg-stone-900 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-stone-900 rounded-r-3xl p-8 border border-stone-400">
               {/* Header */}
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r text-stone-400 mb-2">
                     Create Account
                  </h1>
                  <p className="text-slate-400 text-sm">
                     Join us to get started
                  </p>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div>
                     <label
                        htmlFor="username"
                        className="block text-sm font-medium text-slate-300 mb-2"
                     >
                        Username
                     </label>
                     <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition"
                     />
                  </div>

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
                     className="w-full py-3 bg-gradient-to-r from-stone-200 to-stone-200 hover:from-stone-300 hover:to-stone-300 text-zinc-800 font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
                  >
                     Create Account
                  </button>
               </form>

               {/* Footer */}
               <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm">
                     Already have an account?{" "}
                     <Link
                        to={"/login"}
                        className="text-gray-300 hover:text-gray-200 font-semibold"
                     >
                        Sign in
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Register;
