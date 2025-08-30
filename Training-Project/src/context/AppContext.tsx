import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AppConstants } from "../util/constants";
import axios from "axios";
import { showToast } from "../lib/toasts";
import { useLocation, useNavigate } from "react-router-dom";

// Define the type for the context
type AppContextType = {
  backendURL: string;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  userData: boolean;
  setUserData: Dispatch<SetStateAction<boolean>>;
  getUserData: () => Promise<void>;
};

// Define the prop type for the provider component
type AppContextProviderProps = {
  children: ReactNode;
};
// Create the context with default value null
export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {

  axios.defaults.withCredentials = true;

  const backendURL = AppConstants.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const publicRoutes = [
    "/",
    "/login",
    "/sign-up",
    "/send-reset-otp",
    "/reset-password",
    "/logout",
  ];

  const getUserData = async () => {
    try {
      const response = await axios.get(backendURL + "/profile");
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        showToast("Unable to retrive the profile", "error");
      }
    } catch (error: any) {
      showToast(error.message || "An unexpected error occurred", "error");
    }
  };

  const getAuthState = async () => {
    try {
      const response = await axios.get(backendURL+"/is-authenticated");
      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error: any) {
      if (error.response) {
        const err =
          error.response.data?.message || "Authentication check faield";
        navigate("/");
        showToast(err, "error");
      } else {
        navigate("/");
        showToast(error.message, "error");
      }
      setIsLoggedIn(false);
    } 
  };

  useEffect(() => {
    if (!publicRoutes.includes(location.pathname)) {
      getAuthState();
    }
  }, [location.pathname]);


  const contextValue: AppContextType = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
