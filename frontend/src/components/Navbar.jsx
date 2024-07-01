
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import useDebounce from '../hooks/useDebounce';
import axios from 'axios';
import { authActions } from '../store/slices/authSlice'; // Import authActions from your authSlice

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const debouncedQuery = useDebounce(query, 500); // 500ms debounce delay
    const token = localStorage.getItem('token');
    const loggedInUser = useSelector((state) => state.auth.user);
    const isLogged = useSelector((state) => state.auth.isLogged); // Get isLogged from Redux state
    const dispatch = useDispatch(); // Get dispatch function from useDispatch

    useEffect(() => {
        const searchUsers = async () => {
            if (!debouncedQuery) {
                setFilteredUsers([]);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5555/api/user/searchUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        query: debouncedQuery
                    }
                });
                setFilteredUsers(response.data);
            } catch (err) {
                console.error('Error searching users:', err);
            }
        };

        searchUsers();
    }, [debouncedQuery, token]);

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleUserClick = (user) => {
        setQuery(`${user.firstName} ${user.lastName}`);
    };

    const handleLogout = () => {
        dispatch(authActions.logout()); // Dispatch the logout action
    };

    return (
        <div className="relative bg-blue-500">
            <div className="w-screen flex flex-row items-center p-1 justify-between bg-blue-600 shadow-xs">
                <div className="ml-8 text-lg text-gray-700 hidden md:flex bg-blue-200 rounded-md">
                    <img src="http://res.cloudinary.com/dlrs7hrhx/image/upload/v1717888454/Image/drpgo5g4dph4anr1kjvx.png" alt="Logo" className="h-12 w-auto" />
                </div>
                { isLogged && <>
                    <span className="w-screen md:w-1/3 h-10 bg-gray-200 cursor-pointer border border-gray-300 text-sm rounded-full flex">
                    <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="flex-grow px-4 rounded-l-full rounded-r-full text-sm focus:outline-none"
                        value={query}
                        onChange={handleChange}
                       
                    />
                    <i className="fas fa-search m-3 mr-5 text-lg text-gray-700 w-4 h-4"></i>
                </span>
                <div className="flex flex-row-reverse mr-4 ml-4 md:hidden">
                    <i className="fas fa-bars"></i>
                </div> </>
                }
                
                <div className="flex flex-row-reverse mr-8 hidden md:flex">
                    {isLogged && (
                        <Link to="/login" className="rounded-full border border-black text-black-700 text-center bg-blue-200 px-4 py-2 m-2" onClick={handleLogout}>Logout</Link>
                    )}
                    {isLogged && (
                        <Link to="/codeeditor" className="rounded-full border border-black text-black-700 text-center bg-blue-200 px-4 py-2 m-2">Code Editor</Link>
                    )}
                    {isLogged && (
                        <Link to="/chat" className="rounded-full border border-black text-black-700 text-center bg-blue-200 px-4 py-2 m-2">Messages</Link>
                    )}
                    {isLogged && (
                        <Link to="/home" className="rounded-full border border-black text-black-700 text-center bg-blue-200 px-4 py-2 m-2">Home</Link>
                    )}
                    {isLogged && (
                        <Link to={`/dashboard/${loggedInUser?._id}`} className="rounded-full border border-black text-black-700 text-center bg-blue-200 px-4 py-2 m-2">Dashboard</Link>
                    )}
                    
                    
                </div>
            </div>
            {query && filteredUsers.length > 0 && (
                <div className="z-10 w-screen md:w-1/4 absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg overflow-hidden ">
                    <ul>
                        {filteredUsers.map(user => (
                            <li key={user._id} className="p-4 border-b border-gray-300 hover:bg-gray-100 flex items-center">
                                <Link
                                    to={`/dashboard/${user._id}`}
                                    className="flex items-center w-full"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="flex-shrink-0 mr-4">
                                        <img className="h-10 w-10 rounded-full" src={user.picturePath || 'https://via.placeholder.com/40'} alt={`${user.firstName} ${user.lastName}`} />
                                    </div>
                                    <div className="text-gray-900 font-semibold">
                                        {user.firstName} {user.lastName}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

