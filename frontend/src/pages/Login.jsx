

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { authActions } from '../store/slices/authSlice';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate(); // Use useNavigate hook
//   const [Inputs, setInputs] = useState({ email: "", password: "" });
//   const dispatch = useDispatch();

//   const change = (e) => {
//     const { name, value } = e.target;
//     setInputs({ ...Inputs, [name]: value });
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5555/api/auth/login", Inputs);
//       const token = response.data.token;
//       const user = response.data.user;

//       localStorage.setItem("token", token);
//       dispatch(authActions.login({ user: user }));

//       // Redirect to the home page after successful login
//       navigate('/home');
//     } catch (error) {
//       console.error('Error logging in:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-custom-bg bg-cover bg-center flex justify-center items-center"> {/* Apply background image */}
//       <div className="max-w-md w-full p-8 bg-blue-200 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
//         <form>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               name="email"
//               onChange={change}
//               value={Inputs.email}
//               type="email"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//               id="email"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               name="password"
//               value={Inputs.password}
//               onChange={change}
//               type="password"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//               id="password"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button onClick={submit} type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5555/api/auth/login", inputs);
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      dispatch(authActions.login({ user: user }));

      // Redirect to the home page after successful login
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-custom-bg bg-cover bg-center flex justify-center items-center">
      <div className="max-w-md w-full p-8 bg-blue-200 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              onChange={change}
              value={inputs.email}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              id="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={inputs.password}
              onChange={change}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <button onClick={submit} type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Not registered? 
            <button 
              onClick={() => navigate("/")} 
              className="text-blue-500 hover:underline ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

