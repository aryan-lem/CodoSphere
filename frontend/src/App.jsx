import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { authActions } from './store/slices/authSlice.jsx';
import { useEffect } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Post from './components/Post.jsx';
import CreatePostForm from './components/CreatePostForm.jsx';
import Home from './pages/Home.jsx';
import axios from 'axios';
import Dashboard from './pages/Dashboard.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CodeEditor from './components/CodeEditor.jsx';



export default function App() {
  const dispatch = useDispatch();
  const isLogged = (state) => {
    return state.auth.isLogged;
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get JWT token from local storage (assuming it's stored there after login)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // Make API call to backend to get user data
        const response = await axios.get('http://localhost:5555/api/user/getUserByjwt', {
          headers: {
            Authorization: `Bearer ${token}` // Attach JWT token to the request
          }
        });

        // setUserData(response.data);
        dispatch(authActions.login({user:response.data}));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="h-screen flex flex-col">
      <Router>
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/' element={<Signup />} />
            <Route exact path='/post' element={<Post />} />
            <Route exact path='/createPost' element={<CreatePostForm />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/chat' element={<ChatPage />} />
            <Route exact path='/dashboard/:id' element={<Dashboard />} />
            <Route exact path='/codeEditor' element={<CodeEditor />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}