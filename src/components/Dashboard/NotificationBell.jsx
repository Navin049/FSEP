"use client"

import { useState, useEffect, useRef } from "react"

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [readNotifications, setReadNotifications] = useState([])
  const refreshIntervalRef = useRef(null)

  // Load read notifications from localStorage on component mount
  useEffect(() => {
    const storedReadNotifications = localStorage.getItem("readNotifications")
    if (storedReadNotifications) {
      setReadNotifications(JSON.parse(storedReadNotifications))
    }
  }, [])

  // Save read notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("readNotifications", JSON.stringify(readNotifications))
  }, [readNotifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/NotificationServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: AbortSignal.timeout(5000),
      })
  
      if (response.ok) {
        const data = await response.json()
        console.log('Notifications data:', data);
        // Filter out read notifications
        const unreadData = data.filter((note) => !readNotifications.includes(note.id))
  
        setNotifications(unreadData)
        console.log("Notifications fetched:", unreadData)
      } else {
        console.error("Failed to fetch notifications")
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    }
  }
  

  // Set up auto-refresh interval
  useEffect(() => {
    fetchNotifications() // Initial fetch

    // Refresh every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchNotifications()
    }, 30000)

    // Clean up interval on component unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  const markAsRead = (notificationId) => {
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId])
    }
  }

  const markAllAsRead = () => {
    const allIds = notifications.map((note) => note.id)
    setReadNotifications([...new Set([...readNotifications, ...allIds])])
  }

  const isRead = (notificationId) => {
    return readNotifications.includes(notificationId)
  }

  const unreadCount = notifications.filter((note) => !isRead(note.id)).length

  return (
    <div className="dropdown">
      <button className="btn btn-light position-relative" onClick={() => setShowDropdown(!showDropdown)}>
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          className="dropdown-menu dropdown-menu-end show mt-2 p-2"
          style={{ minWidth: "300px", maxHeight: "400px", overflow: "auto" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <h6 className="mb-0">Notifications</h6>
            {notifications.length > 0 && (
              <button className="btn btn-sm btn-link text-decoration-none" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          <div className="dropdown-divider"></div>
          {notifications.length === 0 ? (
            <div className="dropdown-item text-muted">No new notifications</div>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className={`dropdown-item ${!isRead(note.id) ? "fw-bold bg-light" : ""}`}
                onClick={() => markAsRead(note.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between">
                  <span className="badge bg-primary me-2">{note.type}</span>
                  {!isRead(note.id) && <span className="badge bg-success">New</span>}
                </div>
                <div className="mt-1">{note.title}</div>
                <small className="text-muted">{new Date(note.time).toLocaleString()}</small>
              </div>
            ))
          )}
          <div className="dropdown-divider mt-2"></div>
          <div className="text-center">
            <button className="btn btn-sm btn-outline-primary" onClick={() => fetchNotifications()}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
