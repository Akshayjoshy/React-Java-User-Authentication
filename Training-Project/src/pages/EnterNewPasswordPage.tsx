import { useState, useEffect, useContext } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { useYupValidationResolver } from "../_hooks/useYupValidationResolver";
import { updatePasswordSchema } from "../schemas/resetPasswordSchema";
import { useForm, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { showToast } from "../lib/toasts";
import ErrorMessage from "../UI/errorMessage";

type PasswordData = {
  newPassword: string;
  confirmPassword: string;
};

interface EnterNewPasswordPageProps {
  email: boolean;
  otp: string[];
}

const EnterNewPasswordPage = ({ email, otp }: EnterNewPasswordPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { backendURL }: any = useContext(AppContext);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordData>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: useYupValidationResolver(updatePasswordSchema),
  });

  const updateNewItem = async (data: FieldValues) => {
    axios.defaults.withCredentials = true;
    setIsLoading(true);
    try {
      const payload = {
        newPassword: data.newPassword,
        email,
        otp: Array.isArray(otp) ? otp.join("") : otp,
      };

      //Reset Password API
      const response = await axios.post(
        `${backendURL}/reset-password`,
        payload
      );
      if (response.status === 200) {
        showToast("Password Reset Successfully", "success");
        navigate("/login");
      } else {
        showToast("Something went wrong please try again", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "An unexpected error occurred",
        "error"
      );
    }
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // reset only password fields
    reset({
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Simulate token validation on component mount
  useEffect(() => {
    // In a real app, you'd extract the token from URL params and validate it
    const validateToken = async () => {
      // Simulate API call to validate reset token
      setTimeout(() => {
        setTokenValid(true); // Set to false to simulate expired/invalid token
      }, 1000);
    };

    validateToken();
  }, []);

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main password reset form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-white overflow-hidden">
      {/* Blurred Animated Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">
              Set New Password
            </h1>
            <p className="text-gray-700">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit(updateNewItem)} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.newPassword?.message
                      ? "border-red-400"
                      : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-400 transition-all`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.newPassword?.message && (
                <ErrorMessage errorMessage={errors.newPassword.message} />
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword?.message
                      ? "border-red-400"
                      : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-400 transition-all`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword?.message && (
                <ErrorMessage errorMessage={errors.confirmPassword.message} />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-4 rounded-xl font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-gray-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-purple-500 mr-2 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-black mb-1">
                  Security Tip
                </h5>
                <p className="text-xs text-gray-700">
                  Use a unique password that you don't use for other accounts.
                  Consider using a password manager to generate and store strong
                  passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterNewPasswordPage;
