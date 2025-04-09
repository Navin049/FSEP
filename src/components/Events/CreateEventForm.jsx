import React, { useState, useEffect } from 'react';

const CreateEventForm = () => {
  // State to hold form input values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [type, setType] = useState('meeting');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]); // To store the list of projects
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the list of projects when the component is mounted
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/backend-servlet/ViewProjectServlet', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects); // Assuming backend returns { projects: [...] }
        } else {
          setMessage('Error fetching projects.');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error fetching projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!eventDate) {
      setMessage('Event date is required');
      setIsSubmitting(false);
      return;
    }

    if (!projectId) {
      setMessage('Please select a project');
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      title,
      description,
      eventDate,
      type,
      projectId, // Include the projectId in the eventData
    };

    try {
      console.log('Sending event data:', eventData);

      const response = await fetch('http://localhost:8080/backend-servlet/CreateEventServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include', // To send cookies (like the session ID) along with the request
      });

      if (response.ok) {
        setMessage('Event created successfully!');
        // Clear the form after successful submission
        setTitle('');
        setDescription('');
        setEventDate('');
        setProjectId('');
      } else {
        setMessage('Error creating event. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating event. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '100vh',
        margin: 'auto',
      }}
    >
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Create New Event</h2>

          <div className="mb-3">
            <label className="form-label w-100">
              Event Title:
              <input
                className="form-control"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Event Description:
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Event Date & Time:
              <input
                className="form-control"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)} // This should update state properly
                required
              />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Event Type:
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* Project Dropdown */}
          <div className="mb-3">
            <label className="form-label w-100">
              Select Project:
              <select
                className="form-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Event'}
          </button>
        </form>

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default CreateEventForm;
