"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

// Import icons from react-bootstrap-icons or another icon library compatible with your setup
// For this example, I'll use comments to indicate where icons would be
// You can install react-bootstrap-icons with: npm install react-bootstrap-icons

export default function Home() {

  const heroStyle = {
    backgroundImage: "url('/aa671cde-60cc-4041-90b5-5d6f146d3ae3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "600px",
    position: "relative",
  }

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={heroStyle} className="d-flex align-items-center justify-content-center text-center">
        <div style={overlayStyle}></div>
        <div className="container position-relative" style={{ zIndex: 10 }}>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-12">
              <h1 className="display-4 fw-bold text-white mb-4">Project Management System</h1>
              <p className="lead text-white mb-5">
                Streamline your workflow, enhance team collaboration, and deliver projects on time with our
                comprehensive management solution.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/AdminLogin" className="btn btn-outline-info btn-lg">
                  Admin Login
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Our project management system provides all the tools you need to plan, execute, and monitor your projects
              effectively.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3">
                    {/* <CheckCircle size={32} /> */}
                    <i className="bi bi-check-circle-fill fs-1"></i>
                  </div>
                  <h5 className="card-title">Task Management</h5>
                  <p className="card-text text-muted">
                    Create, assign, and track tasks with ease. Set priorities and deadlines to keep everything on
                    schedule.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3">
                    {/* <Users size={32} /> */}
                    <i className="bi bi-people-fill fs-1"></i>
                  </div>
                  <h5 className="card-title">Team Collaboration</h5>
                  <p className="card-text text-muted">
                    Foster teamwork with real-time updates, file sharing, and communication tools all in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3">
                    {/* <BarChart3 size={32} /> */}
                    <i className="bi bi-bar-chart-fill fs-1"></i>
                  </div>
                  <h5 className="card-title">Progress Tracking</h5>
                  <p className="card-text text-muted">
                    Monitor project progress with visual dashboards and detailed reports to make informed decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3">
                    {/* <Clock size={32} /> */}
                    <i className="bi bi-clock-fill fs-1"></i>
                  </div>
                  <h5 className="card-title">Time Management</h5>
                  <p className="card-text text-muted">
                    Track time spent on tasks and projects to improve productivity and resource allocation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      {/* CTA Section */}
      <div className="py-5 bg-primary text-white w-100">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of teams already using our platform to manage their projects efficiently.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/AdminLogin" className="btn btn-light btn-lg">
                  Admin Login
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  User Login
                  {/* <ArrowRight className="ms-2" size={16} /> */}
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-light border-top">
        <div className="container text-center">
          <p className="text-muted mb-0">
            © {new Date().getFullYear()} Project Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

