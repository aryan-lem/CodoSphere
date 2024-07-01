import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ firstName: "", lastName: "", password: "", confirmPassword: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
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
      alert("Please fill in all the details.");
      return;
    }

    // Check if passwords match
    if (inputs.password !== inputs.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5555/api/auth/register", {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        password: inputs.password,
      });
      navigate("/login");
    } catch (error) {
      console.log("Status is --> ", error.response.status);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 bg-custom-bg bg-cover bg-center bg-fixed overflow-hidden">
      <div className="max-w-md w-full p-8 bg-blue-200 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              onChange={change}
              value={inputs.firstName}
              className={`mt-1 block w-full rounded-md border ${emptyFields.includes('firstName') ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              id="firstName"
              placeholder="Enter your first name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              onChange={change}
              value={inputs.lastName}
              className={`mt-1 block w-full rounded-md border ${emptyFields.includes('lastName') ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              id="lastName"
              placeholder="Enter your last name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={change}
              value={inputs.email}
              className={`mt-1 block w-full rounded-md border ${emptyFields.includes('email') ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              id="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={change}
              className={`mt-1 block w-full rounded-md border ${emptyFields.includes('password') ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={change}
              className={`mt-1 block w-full rounded-md border ${emptyFields.includes('confirmPassword') ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              id="confirmPassword"
              placeholder="Confirm your password"
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already registered? 
            <button 
              onClick={() => navigate("/login")} 
              className="text-blue-500 hover:underline ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

