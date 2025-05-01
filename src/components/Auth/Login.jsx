"use client"

import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaEnvelope, FaUserTie } from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Project Manager")
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) newErrors.email = "Email is required"
    else if (!regexEmail.test(email)) newErrors.email = "Invalid email format"
    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/LoginServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password, role }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        if (data.message === "Login successful!") {
          setMessage("Login successful! Redirecting...")

          const { userId } = data
          localStorage.setItem("loggedInUser", JSON.stringify({ email, role, userId }))

          if (data.redirect) {
            console.log("Redirecting to:", data.redirect)
            setTimeout(() => {
              navigate(data.redirect)
            }, 1000)
          } else {
            setMessage("Redirect path is missing in response.")
          }
        } else {
          setMessage(data.message || "Login failed!")
        }
      } else {
        setMessage("Login failed due to server error.")
      }
    } catch (error) {
      console.error("Error during login:", error)
      setMessage("An error occurred while logging in.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="row g-0">
            {/* Left side - Image and branding */}
            <div className="col-md-5 d-none d-md-block">
              <div className="login-image-container">
                <div className="login-overlay"></div>
                <div className="login-content">
                  <h2>Project Management System</h2>
                  <p>Streamline your workflow and boost team productivity</p>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="col-md-7">
              <div className="login-form-container">
                <div className="text-center mb-4">
                  <div className="logo-container">
                    <div className="logo-icon">PM</div>
                  </div>
                  <h2 className="welcome-text">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to your dashboard</p>
                </div>

                {message && (
                  <div
                    className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"} mt-4 d-flex align-items-center`}
                  >
                    <i
                      className={`bi ${message.includes("successful") ? "bi-check-circle" : "bi-exclamation-triangle"} me-2`}
                    ></i>
                    {message}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <div className="form-floating input-group">
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="emailInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="emailInput">Email address</label>
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        id="passwordInput"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="passwordInput">Password</label>
                      <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating input-group">
                      <select
                        className="form-select"
                        id="roleSelect"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="Project Manager">Project Manager</option>
                        <option value="Team Member">Team Member</option>
                      </select>
                      <label htmlFor="roleSelect">Role</label>
                      <span className="input-group-text">
                        <FaUserTie />
                      </span>
                    </div>
                  </div>

                  {/* <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div> */}

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
                    <p>
                      Don't have an account?{" "}
                      <Link to="/ServletRegister" className="text-decoration-none fw-bold">
                        Sign up
                      </Link>
                    </p>
                    <Link to="/" className="btn btn-outline-secondary mt-2">
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
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f8fb;
          padding: 2rem 1rem;
        }
        
        .login-wrapper {
          width: 100%;
          max-width: 900px;
        }
        
        .login-card {
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .login-image-container {
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
        
        .login-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(32, 66, 219, 0.8), rgba(59, 130, 246, 0.8));
        }
        
        .login-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
        }
        
        .login-form-container {
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
          background: linear-gradient(135deg, #3b82f6, #2042db);
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
        
        .form-floating > .form-control,
        .form-floating > .form-select {
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
          background: linear-gradient(135deg, #3b82f6, #2042db);
          border: none;
          font-weight: 500;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }
        
        @media (max-width: 767.98px) {
          .login-form-container {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Login

