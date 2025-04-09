"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { FaEnvelope, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa"

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({ email: "", password: "", role: "Admin" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setAdminData({ ...adminData, [name]: value })
  }

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/AdminLoginServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok) {
        // If login is successful, save user info in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify({ email: adminData.email, role: adminData.role }))

        // Show success message briefly before redirecting
        setError({ type: "success", message: "Login successful! Redirecting..." })

        // Redirect to the admin dashboard based on role
        setTimeout(() => {
          if (adminData.role === "Admin") {
            navigate("/admin-dashboard")
          } else {
            navigate("/home")
          }
        }, 1000)
      } else {
        // If login fails, show the error message
        setError({ type: "danger", message: result.message || "Login failed! Please check your credentials." })
      }
    } catch (error) {
      setError({ type: "danger", message: "An error occurred. Please try again later." })
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="row g-0">
            {/* Left side - Image and branding */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="admin-image-container">
                <div className="admin-overlay"></div>
                <div className="admin-content">
                  <h2>Admin Portal</h2>
                  <p>Secure access to manage your organization's projects and teams</p>

                  <div className="features-list">
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-shield-lock"></i>
                      </div>
                      <div className="feature-text">
                        <h5>Secure Access</h5>
                        <p>Enhanced security for administrative functions</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <div className="feature-text">
                        <h5>Analytics Dashboard</h5>
                        <p>Comprehensive insights and reporting</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-gear"></i>
                      </div>
                      <div className="feature-text">
                        <h5>System Management</h5>
                        <p>Complete control over users and projects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="col-lg-7">
              <div className="admin-form-container">
                <div className="text-center mb-4">
                  <div className="logo-container">
                    <div className="logo-icon">
                      <FaUserShield size={24} />
                    </div>
                  </div>
                  <h2 className="welcome-text">Admin Login</h2>
                  <p className="text-muted">Enter your credentials to access the admin dashboard</p>
                </div>

                {error && (
                  <div className={`alert alert-${error.type} d-flex align-items-center`}>
                    <i
                      className={`bi ${error.type === "success" ? "bi-check-circle" : "bi-exclamation-triangle"} me-2`}
                    ></i>
                    {error.message}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <div className="form-floating input-group">
                      <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        name="email"
                        placeholder="name@example.com"
                        value={adminData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="emailInput">Email address</label>
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="passwordInput"
                        name="password"
                        placeholder="Password"
                        value={adminData.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="passwordInput">Password</label>
                      <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-decoration-none">
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 mb-4" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center">
                    <Link to="/" className="btn btn-outline-secondary">
                      <i className="bi bi-house-door me-2"></i>Back to Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f8fb;
          padding: 2rem 1rem;
        }
        
        .admin-login-wrapper {
          width: 100%;
          max-width: 900px;
        }
        
        .admin-login-card {
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .admin-image-container {
          background-image: url('/placeholder.svg?height=600&width=400');
          background-size: cover;
          background-position: center;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }
        
        .admin-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.9), rgba(138, 43, 226, 0.8));
        }
        
        .admin-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
        }
        
        .admin-form-container {
          padding: 3rem 2rem;
        }
        
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #6f42c1, #8a2be2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
        }
        
        .welcome-text {
          font-weight: 700;
          color: #1e293b;
        }
        
        .form-floating > .form-control {
          border-right: none;
          height: calc(3.5rem + 2px);
        }
        
        .input-group-text {
          background-color: transparent;
          border-left: none;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #6f42c1, #8a2be2);
          border: none;
          font-weight: 500;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #5e35b1, #7b1fa2);
        }
        
        .features-list {
          margin-top: 2rem;
          text-align: left;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.5rem;
        }
        
        .feature-text h5 {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        
        .feature-text p {
          margin-bottom: 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
        
        @media (max-width: 991.98px) {
          .admin-form-container {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminLogin

