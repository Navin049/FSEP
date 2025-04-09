"use client"

import React, { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link, useNavigate } from "react-router-dom"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaLock,
  FaUserTie,
  FaUserCog,
  FaCalendarCheck,
  FaTools,
  FaUserGraduate,
} from "react-icons/fa"

const ServletRegister = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    bio: "",
    profilePic: "",
    password: "",
    role: "Project Manager",
    Subrole: "Developer",
    availability: "Available",
    skills: "",
    experienceLevel: "Junior",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  React.useEffect(() => {
    document.body.classList.add("register-page")
    return () => document.body.classList.remove("register-page")
  }, [])

  const validateStep = (step) => {
    const newErrors = {}
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^[0-9]{10}$/

    if (step === 1) {
      if (!userData.name) newErrors.name = "Full name is required"
      if (!userData.email) newErrors.email = "Email is required"
      else if (!regexEmail.test(userData.email)) newErrors.email = "Invalid email format"
      if (!userData.phone) newErrors.phone = "Phone number is required"
      else if (!regexPhone.test(userData.phone)) newErrors.phone = "Phone number must be 10 digits"
      if (!userData.password) newErrors.password = "Password is required"
      else if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters long"
    } else if (step === 2) {
      if (!userData.company) newErrors.company = "Company name is required"
      if (!userData.address) newErrors.address = "Address is required"
      if (!userData.skills) newErrors.skills = "Skills are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors = {}
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^[0-9]{10}$/

    if (!userData.name) newErrors.name = "Full name is required"
    if (!userData.email) newErrors.email = "Email is required"
    else if (!regexEmail.test(userData.email)) newErrors.email = "Invalid email format"
    if (!userData.phone) newErrors.phone = "Phone number is required"
    else if (!regexPhone.test(userData.phone)) newErrors.phone = "Phone number must be 10 digits"
    if (!userData.company) newErrors.company = "Company name is required"
    if (!userData.address) newErrors.address = "Address is required"
    if (!userData.password) newErrors.password = "Password is required"
    else if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters long"
    if (!userData.skills) newErrors.skills = "Skills are required"
    if (!userData.availability) newErrors.availability = "Availability is required"
    if (!userData.experienceLevel) newErrors.experienceLevel = "Experience level is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/RegisterServlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      })

      console.log("Response Status:", response.status)
      console.log("Response Headers:", response.headers)

      const result = await response.json()

      console.log("Response Data:", result)

      setMessage({
        text: result.message,
        type: result.message.includes("successful") ? "success" : "danger",
      })

      if (result.redirect) {
        localStorage.setItem("loggedInUser", JSON.stringify({ email: userData.email, role: userData.role }))
        setTimeout(() => {
          navigate(result.redirect)
        }, 1500)
      }
    } catch (error) {
      console.error("Fetch Error:", error)
      setMessage({ text: "Registration failed. Please try again.", type: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUserData({ ...userData, profilePic: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const renderStep1 = () => (
    <>
      <h4 className="step-title">Personal Information</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="nameInput"
              placeholder="Enter full name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <label htmlFor="nameInput">Full Name</label>
            <span className="input-group-text">
              <FaUser />
            </span>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="emailInput"
              placeholder="Enter email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <label htmlFor="emailInput">Email</label>
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="text"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              id="phoneInput"
              placeholder="Enter phone number"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            />
            <label htmlFor="phoneInput">Phone Number</label>
            <span className="input-group-text">
              <FaPhone />
            </span>
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="passwordInput"
              placeholder="Enter password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <label htmlFor="passwordInput">Password</label>
            <span className="input-group-text">
              <FaLock />
            </span>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Profile Picture</label>
        <div className="profile-upload-container">
          <div className="profile-preview">
            {userData.profilePic ? (
              <img src={userData.profilePic || "/placeholder.svg"} alt="Profile Preview" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <FaUser size={40} />
              </div>
            )}
          </div>
          <div className="upload-button-container">
            <label htmlFor="profilePicInput" className="btn btn-outline-primary">
              Choose Image
            </label>
            <input
              id="profilePicInput"
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
            <small className="text-muted d-block mt-2">Upload a professional profile picture (optional)</small>
          </div>
        </div>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <h4 className="step-title">Professional Information</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="text"
              className={`form-control ${errors.company ? "is-invalid" : ""}`}
              id="companyInput"
              placeholder="Enter company name"
              value={userData.company}
              onChange={(e) => setUserData({ ...userData, company: e.target.value })}
            />
            <label htmlFor="companyInput">Company Name</label>
            <span className="input-group-text">
              <FaBuilding />
            </span>
            {errors.company && <div className="invalid-feedback">{errors.company}</div>}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <input
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              id="addressInput"
              placeholder="Enter permanent address"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
            <label htmlFor="addressInput">Address</label>
            <span className="input-group-text">
              <FaMapMarkerAlt />
            </span>
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="form-floating">
          <textarea
            className="form-control"
            id="bioInput"
            placeholder="Write something about yourself"
            style={{ height: "100px" }}
            value={userData.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          ></textarea>
          <label htmlFor="bioInput">Bio</label>
        </div>
        <small className="text-muted">Tell us about your professional background and interests</small>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <select
              className="form-select"
              id="roleInput"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
            </select>
            <label htmlFor="roleInput">Role</label>
            <span className="input-group-text">
              <FaUserTie />
            </span>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <select
              className="form-select"
              id="subroleInput"
              value={userData.Subrole}
              onChange={(e) => setUserData({ ...userData, Subrole: e.target.value })}
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="QA">QA</option>
              <option value="Tester">Tester</option>
            </select>
            <label htmlFor="subroleInput">Sub Role</label>
            <span className="input-group-text">
              <FaUserCog />
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <select
              className="form-select"
              id="availabilityInput"
              value={userData.availability}
              onChange={(e) => setUserData({ ...userData, availability: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            <label htmlFor="availabilityInput">Availability</label>
            <span className="input-group-text">
              <FaCalendarCheck />
            </span>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating input-group">
            <select
              className="form-select"
              id="experienceInput"
              value={userData.experienceLevel}
              onChange={(e) => setUserData({ ...userData, experienceLevel: e.target.value })}
            >
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
            </select>
            <label htmlFor="experienceInput">Experience Level</label>
            <span className="input-group-text">
              <FaUserGraduate />
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="form-floating input-group">
          <input
            type="text"
            className={`form-control ${errors.skills ? "is-invalid" : ""}`}
            id="skillsInput"
            placeholder="Enter skills (comma-separated)"
            value={userData.skills}
            onChange={(e) => setUserData({ ...userData, skills: e.target.value })}
          />
          <label htmlFor="skillsInput">Skills</label>
          <span className="input-group-text">
            <FaTools />
          </span>
          {errors.skills && <div className="invalid-feedback">{errors.skills}</div>}
        </div>
        <small className="text-muted">
          Enter your skills separated by commas (e.g., JavaScript, React, Project Management)
        </small>
      </div>
    </>
  )

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="row g-0">
            {/* Left side - Image and branding */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="register-image-container">
                <div className="register-overlay"></div>
                <div className="register-content">
                  <h2>Join Our Team</h2>
                  <p>Create an account to start managing projects and collaborating with your team</p>

                  <div className="features-list">
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-kanban"></i>
                      </div>
                      <div className="feature-text">
                        <h5>Project Management</h5>
                        <p>Create and manage projects efficiently</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="feature-text">
                        <h5>Team Collaboration</h5>
                        <p>Work together seamlessly with your team</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <div className="feature-text">
                        <h5>Progress Tracking</h5>
                        <p>Monitor project progress in real-time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Registration form */}
            <div className="col-lg-7">
              <div className="register-form-container">
                <div className="text-center mb-4">
                  <div className="logo-container">
                    <div className="logo-icon">PM</div>
                  </div>
                  <h2 className="welcome-text">Create Account</h2>
                  <p className="text-muted">Fill in your details to get started</p>
                </div>

                {/* Progress indicator */}
                <div className="progress-container mb-4">
                  <div className="progress-steps">
                    <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
                      <div className="step-number">1</div>
                      <div className="step-label d-none d-md-block">Personal</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
                      <div className="step-number">2</div>
                      <div className="step-label d-none d-md-block">Professional</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegister}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}

                  <div className="d-flex justify-content-between mt-4">
                    {currentStep > 1 && (
                      <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
                        <i className="bi bi-arrow-left me-2"></i>Back
                      </button>
                    )}

                    {currentStep < 2 ? (
                      <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>
                        Next<i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-success ms-auto" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Registering...
                          </>
                        ) : (
                          <>Complete Registration</>
                        )}
                      </button>
                    )}
                  </div>

                  {message.text && (
                    <div className={`alert alert-${message.type} mt-4 d-flex align-items-center`}>
                      <i
                        className={`bi ${message.type === "success" ? "bi-check-circle" : "bi-exclamation-triangle"} me-2`}
                      ></i>
                      {message.text}
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <p>
                      Already have an account?{" "}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Sign in
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
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f8fb;
          padding: 2rem 1rem;
        }
        
        .register-wrapper {
          width: 100%;
          max-width: 1100px;
        }
        
        .register-card {
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .register-image-container {
          background-image: url('/placeholder.svg?height=900&width=500');
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
        
        .register-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(32, 201, 151, 0.8));
        }
        
        .register-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
        }
        
        .register-form-container {
          padding: 2rem;
        }
        
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #28a745, #20c997);
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
        
        .progress-container {
          width: 100%;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        
        .progress-line {
          position: absolute;
          top: 24px;
          left: 50px;
          right: 50px;
          height: 2px;
          background-color: #e9ecef;
          z-index: 1;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        
        .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .step-label {
          font-size: 0.875rem;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        
        .progress-step.active .step-number {
          background-color: #28a745;
          color: white;
        }
        
        .progress-step.active .step-label {
          color: #28a745;
          font-weight: 600;
        }
        
        .step-title {
          margin-bottom: 1.5rem;
          color: #343a40;
          font-weight: 600;
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
        
        .profile-upload-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .profile-preview {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #dee2e6;
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-placeholder {
          color: #adb5bd;
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
          .register-form-container {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ServletRegister

