import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const backgroundStyle = {
  backgroundImage: "url('/background.jpeg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed", // Keeps background fixed
  width: "100vw", // Full width
  height: "100vh", // Full height
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "black",
  overflow: "hidden", // Prevent scrolling
  position: "fixed", // Fixes background in place
  top: 0,
  left: 0,
};


const Home = () => {
  return (
    <div style={backgroundStyle}>
    <div className="container text-center mt-5 w-100 ">
      <h1 className="title">Welcome to Project Management System</h1>
      <p className="paragraph">Efficiently manage your projects, teams, and progress.</p>
      
      <div className="mt-4">
        <Link to="/AdminLogin" className="btn btn-primary m-2">Admin Login</Link>
        <Link to="/login" className="btn btn-outline-secondary m-2 ">User Login</Link>
      </div>
    </div>
    </div>
  );
};

export default Home;
