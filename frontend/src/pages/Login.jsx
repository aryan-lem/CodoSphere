import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, inputs);
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      dispatch(authActions.login({ user: user }));

      // Redirect to the home page after successful login
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container bg-custom-bg">
      <div className="auth-card">
        <div className="codosphere-brand">
          <h1 className="codosphere-logo">Codosphere</h1>
          <p className="codosphere-tagline">Connect, Code, Collaborate</p>
        </div>
        
        <h2 className="auth-title">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              name="email"
              onChange={change}
              value={inputs.email}
              type="email"
              className="auth-input"
              id="email"
              placeholder="Enter your email"
              required
            />
            <div className="focus-border"></div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              name="password"
              value={inputs.password}
              onChange={change}
              type="password"
              className="auth-input"
              id="password"
              placeholder="Enter your password"
              required
            />
            <div className="focus-border"></div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Not registered? 
            <button 
              onClick={() => navigate("/")} 
              className="auth-link ml-1"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;