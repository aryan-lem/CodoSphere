import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ firstName: "", lastName: "", password: "", confirmPassword: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    
    // Clear field from empty fields list when typing
    if (emptyFields.includes(name)) {
      setEmptyFields(emptyFields.filter(field => field !== name));
    }
    
    // Clear error message when typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    // Reset empty fields array
    setEmptyFields([]);

    // Check for empty fields
    const emptyFieldsArray = [];
    for (const key in inputs) {
      if (!inputs[key]) {
        emptyFieldsArray.push(key);
      }
    }

    // Highlight empty fields and show alert
    if (emptyFieldsArray.length > 0) {
      setEmptyFields(emptyFieldsArray);
      setErrorMessage("Please fill in all required fields");
      return;
    }

    // Check if passwords match
    if (inputs.password !== inputs.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}/api/auth/register`, {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        password: inputs.password,
      });
      navigate("/login");
    } catch (error) {
      console.error('Error registering:', error);
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container bg-custom-bg">
      <div className="auth-card">
        <div className="codosphere-brand">
          <h1 className="codosphere-logo">Codosphere</h1>
          <p className="codosphere-tagline">Your coding community awaits</p>
        </div>
        
        <h2 className="auth-title">Create an Account</h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-100 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={submit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="firstName" className="auth-label">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                onChange={change}
                value={inputs.firstName}
                className={`auth-input ${emptyFields.includes('firstName') ? 'error' : ''}`}
                id="firstName"
                placeholder="Enter your first name"
              />
              <div className="focus-border"></div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="auth-label">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                onChange={change}
                value={inputs.lastName}
                className={`auth-input ${emptyFields.includes('lastName') ? 'error' : ''}`}
                id="lastName"
                placeholder="Enter your last name"
              />
              <div className="focus-border"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={change}
              value={inputs.email}
              className={`auth-input ${emptyFields.includes('email') ? 'error' : ''}`}
              id="email"
              placeholder="Enter your email"
            />
            <div className="focus-border"></div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={change}
              className={`auth-input ${emptyFields.includes('password') ? 'error' : ''}`}
              id="password"
              placeholder="Create a strong password"
            />
            <div className="focus-border"></div>
          </div>

          <div className="form-group mb-6">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={change}
              className={`auth-input ${emptyFields.includes('confirmPassword') ? 'error' : ''}`}
              id="confirmPassword"
              placeholder="Confirm your password"
            />
            <div className="focus-border"></div>
          </div>

          

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <button 
              onClick={() => navigate("/login")} 
              className="auth-link ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;