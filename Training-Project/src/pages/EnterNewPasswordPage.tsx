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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600">
              Choose a strong password to secure your account.
            </p>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <form onSubmit={handleSubmit(updateNewItem)} className="space-y-6">
              <div className="space-y-2">
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </div>
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
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </div>
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
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-1">
                  Security Tip
                </h5>
                <p className="text-xs text-gray-600">
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
