import DashboardPage from "./components/DashboardPage";
import EmailVerify from "./pages/EmailVerify";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
