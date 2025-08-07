import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [preferredTime, setPreferredTime] = useState('');
  const [restDays, setRestDays] = useState('');
  const [daysEnabled, setDaysEnabled] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleDay = (day) => {
    setDaysEnabled(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required.');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }
    if (!preferredTime.trim()) {
      setError('Preferred workout time is required.');
      return false;
    }
    if (restDays === '' || restDays < 0 || restDays > 7) {
      setError('Desired rest days must be a number between 0 and 7.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    // Fake userID set for testing
    localStorage.setItem('userID', '3');

   

    alert('Registration successful!');
    navigate('/calendar');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="title">Register Fit-Plan Account</h1>
        <div className="form-preferences-split">
          {/* Left side: Register form */}
          <form onSubmit={handleSubmit} className="register-form">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Register</button>
          </form>

          {/* Right side: Preferences */}
          <div className="preferences-container">
            <h3>Preferences</h3>
            <div className="days-toggle-group">
              {daysOfWeek.map(day => (
                <label key={day} className="day-toggle-label">
                  <input
                    type="checkbox"
                    checked={daysEnabled[day]}
                    onChange={() => toggleDay(day)}
                  />
                  {day}
                </label>
              ))}
            </div>

            <label htmlFor="preferredTime">Preferred Workout Time:</label>
            <input
              type="text"
              id="preferredTime"
              value={preferredTime}
              onChange={e => setPreferredTime(e.target.value)}
              placeholder="e.g. 7:00pm"
              required
            />

            <label htmlFor="restDays">Desired Rest Days:</label>
            <input
              type="number"
              id="restDays"
              value={restDays}
              onChange={e => setRestDays(Number(e.target.value))}
              min={0}
              max={7}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;    