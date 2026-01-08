import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, User, Smartphone, Lock, Eye, EyeOff } from "lucide-react";
import { useActionCall, useQueryParams } from "@/hooks";
import { useFormik } from "formik";
import { SERVICE } from "@/constants/services";
import logo from '@/assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const { loading, Post, error } = useActionCall(SERVICE.LOGIN);
  const [loginMethod, setLoginMethod] = useState<"username" | "mobile">(
    "username"
  );

  const [showPassword, setShowPassword] = useState(false);

  const { values, handleChange, errors, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      let response: any = await Post(values, "Login successfull");
      if (response) {
        login(response.data.access_token);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="flex justify-center items-center space-x-3 mb-6"
        >
          <img src={logo} alt="Logo" className="w-12 h-12" />
          {/* <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div> */}
          {/* <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
            Starup
          </span> */}
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account to continue your journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username/Mobile Input */}
            <div>
              <label
                htmlFor={loginMethod}
                className="block text-sm font-medium text-gray-700"
              >
                {loginMethod === "username" ? "Username" : "Mobile Number"}
              </label>
              <div className="mt-1 relative">
                <input
                  id={loginMethod}
                  name={"username"}
                  type={loginMethod === "mobile" ? "tel" : "text"}
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={
                    loginMethod === "username"
                      ? "Enter your username"
                      : "Enter your mobile number"
                  }
                  value={values.username}
                  onChange={handleChange}
                />
                {error && <p style={{ color: "red" }}>{error?.["username"]}</p>}

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {loginMethod === "username" ? (
                    <User className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {error && <p style={{ color: "red" }}>{error?.["password"]}</p>}
            </div>

            {/* {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )} */}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-yellow-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
