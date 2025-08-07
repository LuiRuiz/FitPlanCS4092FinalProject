import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // used to simualte login just enters if it meets email value
    if (email.toLowerCase() === 'main@fitplan.dev') {
      localStorage.setItem('userID', '1');
      setTimeout(() => {
        //navigate after half a second
        navigate('/calendar'); 
      }, 500);

    } else {
      setError('Login failed. Email not recognized.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">FitPlan (V1)</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;