import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call the backend to invalidate the session
    const logoutUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/LogoutServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
 
          },
          credentials: "include", // To ensure cookies are sent
        });

        if (response.ok) {
         
          localStorage.removeItem("loggedInUser");
          
          navigate("/login"); 
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    // Perform the logout
    logoutUser();
  }, [navigate]);

  return null; // No UI needed, just a redirect
};

export default Logout;
