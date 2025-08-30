import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import OTPVerificationPage from "./OTPVerificationPage";
import { Check, Key, Mail, Send } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useYupValidationResolver } from "../_hooks/useYupValidationResolver";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import { useForm, type FieldValues } from "react-hook-form";
import axios from "axios";
import ErrorMessage from "../UI/errorMessage";
import { showToast } from "../lib/toasts";

type ResetFormInputs = {
  email: string;
};

interface EmailSubmitPageProps {
  type?: "reset";
}

const ResetPassword: React.FC<EmailSubmitPageProps> = ({ type = "reset" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const { backendURL }: any = useContext(AppContext);

  const isResetPage = type === "reset";

  const pageConfig = {
    reset: {
      title: "Reset Password",
      subtitle: "Enter your email to reset your password",
      buttonText: "Send Reset OTP",
      icon: Key,
      gradient: "from-rose-500 to-orange-500",
      bgGradient: "from-rose-900 via-pink-900 to-orange-900",
      successTitle: "Check Your Email",
      successMessage: `We've sent a password reset otp to your email address. Click the link in the email to reset your password.`,
      helpText:
        "Enter the email address associated with your account and we'll send you an otp to reset your password.",
    },
  };

  const config = pageConfig[type];

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    defaultValues: {
      email: "",
    },
    resolver: useYupValidationResolver(resetPasswordSchema),
  });

  const addNewItem = async (data: FieldValues) => {
    axios.defaults.withCredentials = true;
    setIsLoading(true);
    try {
      //Reset Password API
      const response = await axios.post(
        `${backendURL}/send-reset-otp?email=${encodeURIComponent(data.email)}`
      );
      if (response.status === 200) {
        showToast("Password Reset OTP send Successfully", "success");
        setSubmittedEmail(true);
      } else {
        showToast("Something Went Wrong Please Try Again", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "An unexpected error occurred",
        "error"
      );
    }

    // Store email for OTP page
    setSubmittedEmail(data.email);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
    reset();
  };

  return (
    <>
      {!isSubmitted ? (
        <div
          className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 w-full max-w-md">
            {/* Email Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <form onSubmit={handleSubmit(addNewItem)}>
                {/* Help Text */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start space-x-3">
                    <config.icon
                      className={`w-5 h-5 ${
                        isResetPage ? "text-rose-300" : "text-emerald-300"
                      } mt-0.5 flex-shrink-0`}
                    />
                    <p
                      className={`text-sm ${
                        isResetPage ? "text-rose-200" : "text-emerald-200"
                      }`}
                    >
                      {config.helpText}
                    </p>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isResetPage ? "text-rose-300" : "text-emerald-300"
                      }`}
                    />
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.email?.message
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email?.message && (
                    <ErrorMessage errorMessage={errors.email.message} />
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${
                    config.gradient
                  } text-white py-4 px-4 rounded-xl font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 ${
                    isResetPage
                      ? "focus:ring-rose-500"
                      : "focus:ring-emerald-500"
                  } focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{config.buttonText}</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Additional Options */}
                <div className="mt-6 space-y-4">
                  {/* Remember Password Link (for reset page) */}
                  {isResetPage && (
                    <div className="text-center">
                      <p className="text-rose-200 text-sm">
                        Remember your password?{" "}
                        <Link
                          to="/login"
                          className="text-rose-300 hover:text-white font-semibold transition-colors underline"
                        >
                          Back to Sign In
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* Create Account Link (for verify page) */}
                  {!isResetPage && (
                    <div className="text-center">
                      <p className="text-emerald-200 text-sm">
                        Don't have an account?{" "}
                        <Link
                          to="/sign-up"
                          className="text-blue-300 hover:text-white font-semibold transition-colors"
                        >
                          Sign up
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Security Notice */}
            {!isSubmitted && (
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-6 h-6 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div
                    className={`text-sm ${
                      isResetPage ? "text-rose-200" : "text-emerald-200"
                    }`}
                  >
                    <p className="font-medium mb-1">Secure & Private</p>
                    <p>
                      {isResetPage
                        ? "Your password reset is secured with encryption. The link will expire after 15 minutes for your safety."
                        : "Your email verification is protected with enterprise-grade security. We never share your email with third parties."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <OTPVerificationPage email={submittedEmail} />
      )}
    </>
  );
};

export default ResetPassword;
