import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove logged-in user from localStorage
    localStorage.removeItem("loggedInUser");

    // Redirect to login page after logout
    navigate("/login");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
