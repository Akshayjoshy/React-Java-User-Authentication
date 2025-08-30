import { Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useContext, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useYupValidationResolver } from "../_hooks/useYupValidationResolver";
import { signUpPageSchema } from "../schemas/signUpPageSchema";
import ErrorMessage from "../UI/errorMessage";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { showToast } from "../lib/toasts";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendURL }: any = useContext(AppContext);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    resolver: useYupValidationResolver(signUpPageSchema),
  });

  const addNewItem = async (data: FieldValues) => {
    axios.defaults.withCredentials = true;
    setIsLoading(true);
    try {
      //Register API
      const response = await axios.post(`${backendURL}/register`, data);
      if (response.status === 201) {
        navigate("/login");
        showToast("Account Created Successfully", "success");
      } else {
        showToast("Email Already Exist", "error");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "An unexpected error occurred", "error");
    }
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    reset();
  };

  return (
    <div className="max-h-[130vh] overflow-y-auto scroll-bar bg-gradient-to-br from-purple-900 to-purple-900 via-indigo-900 flex items-center justify-center p-4">
      {/* <div className="absolute inset-0 bg-black/20"></div> */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-4">
          {/* <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <UserPlus className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-200">Join us and get started</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit(addNewItem)} className="space-y-6">
            {/* Name Fields */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name?.message
                      ? "border-red-400"
                      : "border-white/20"
                  }`}
                  placeholder="Full name"
                />
              </div>
              {errors.name?.message && (
                <ErrorMessage errorMessage={errors.name.message} />
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email?.message ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email?.message && (
                <ErrorMessage errorMessage={errors.email.message} />
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password?.message
                      ? "border-red-400"
                      : "border-white/20"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password?.message && (
                <ErrorMessage errorMessage={errors.password.message} />
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword?.message
                      ? "border-red-400"
                      : "border-white/20"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword?.message && (
                <ErrorMessage errorMessage={errors.confirmPassword.message} />
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                />
                <span className="text-sm text-blue-200 leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white underline transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white underline transition-colors"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.acceptTerms?.message && (
                <ErrorMessage errorMessage={errors.acceptTerms.message} />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-blue-300">Or sign up with</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>
          {/* Login Link */}
          <p className="mt-6 text-center text-blue-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 hover:text-white font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
