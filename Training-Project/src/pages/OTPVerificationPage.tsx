import { Check, Mail } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import EnterNewPasswordPage from "./EnterNewPasswordPage";

interface OTPVerificationPageProps {
  email: boolean;
}

const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({ email }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isResending, setIsResending] = useState(false);
  // const [resendTimer, setResendTimer] = useState(60);
  // const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend functionality
  // useEffect(() => {
  //   if (resendTimer > 0) {
  //     const timer = setTimeout(() => {
  //       setResendTimer(resendTimer - 1);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setCanResend(true);
  //   }
  // }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Only allow single digit
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        if (digits.length <= 6) {
          const newOtp = [...otp];
          for (let i = 0; i < digits.length; i++) {
            newOtp[i] = digits[i];
          }
          setOtp(newOtp);
          // Focus the next empty input or the last filled input
          const nextIndex = Math.min(digits.length, 5);
          inputRefs.current[nextIndex]?.focus();
        }
      });
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(true);

    // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false);
    //   // Simulate success/failure
    //   if (otpString === "123456") {
    //     setSuccess(true);
    //     setTimeout(() => {
    //       alert("Email verified successfully! Redirecting to dashboard...");
    //     }, 1500);
    //   } else {
    //     setError("Invalid OTP. Please try again.");
    //     setOtp(["", "", "", "", "", ""]);
    //     inputRefs.current[0]?.focus();
    //   }
    // }, 2000);
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <>
      {!success ? (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              {/* <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            {success ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div> */}
              <h1 className="text-3xl font-bold text-white mb-2">
                {success ? "Verified!" : "Verify Your Email"}
              </h1>
              <p className="text-emerald-200">
                {success
                  ? "Your email has been successfully verified"
                  : `We've sent a 6-digit code to`}
              </p>
              {!success && (
                <p className="text-white font-medium mt-1">{email}</p>
              )}
            </div>

            {/* OTP Verification Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <>
                {/* OTP Input Fields */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-white mb-4 text-center">
                    Enter 6-digit code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-2xl font-bold bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          error
                            ? "border-red-400 animate-shake"
                            : "border-white/20"
                        } ${digit ? "bg-white/20 border-emerald-400" : ""}`}
                        placeholder="0"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm mt-3 text-center animate-pulse">
                      {error}
                    </p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!isComplete || isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 px-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
                {/* Help Text */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-emerald-200">
                      <p className="font-medium mb-1">Check your email</p>
                      <p>
                        The code may take up to 2 minutes to arrive. Don't
                        forget to check your spam folder.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      ) : (
        <EnterNewPasswordPage email={email} otp={otp} />
      )}
    </>
  );
};

export default OTPVerificationPage;
