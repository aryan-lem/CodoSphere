import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useDispatch, useSelector } from 'react-redux';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'; // Import icons from react-icons library

const UserCard = ({ user,setUser }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [isFriend, setIsFriend] = useState(false); // Initialize isFriend state to false

  useEffect(() => {
    if (user) {
      setIsFriend(user.friends.includes(loggedInUser?._id)); // Set isFriend based on user's friends list
    }
  }, [user, loggedInUser]); // Update isFriend when user or loggedInUser changes

  const handleAddRemoveFriend = async () => {
    try {
      const response = await axios.patch(`http://localhost:5555/api/user/${loggedInUser._id}/${user._id}`);
      const updatedFriends = response.data;
      dispatch({ type: 'UPDATE_FRIENDS', payload: updatedFriends }); // Dispatch action to update friends list in Redux state
      setIsFriend(!isFriend); // Toggle friend status
    } catch (error) {
      console.error('Error adding/removing friend:', error);
    }
  };

  if (!user) {
    return null; // Or you could return some placeholder content or message
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 m-4 w-full max-w-4xl mx-auto transform transition-transform duration-300 flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        <img
          className="rounded-full w-2/3 h-2/3 mb-4"
          src={user.picturePath || "default-profile.png"}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <h2 className="text-4xl font-semibold text-center">
          {user.firstName} {user.lastName}
        </h2>
        {loggedInUser?._id !== user?._id && ( // Show button only if the user is not the logged-in user
          <button className={`mt-4 px-4 py-2 ${isFriend ? 'bg-red-500' : 'bg-green-500'} text-white rounded-md flex items-center`} onClick={handleAddRemoveFriend}>
            {isFriend ? <FaUserMinus /> : <FaUserPlus />}
          </button>
        )}
      </div>
      <div className="mt-8 w-full text-center">
        <p className="text-gray-600 mt-2">{user.email}</p>
        {user.location && (
          <p className="text-gray-600 mt-2">Location: {user.location}</p>
        )}
        {user?.occupation && (
          <p className="text-gray-600 mt-2">Occupation: {user.occupation}</p>
        )}
        <p className="text-gray-600 mt-2">Friends: {user.friends?.length || 0}</p>
        {typeof user.viewedProfile === 'number' && (
          <p className="text-gray-600 mt-2">Viewed Profile: {user.viewedProfile}</p>
        )}
        {typeof user.impressions === 'number' && (
          <p className="text-gray-600 mt-2">Impressions: {user.impressions}</p>
        )}
      </div>
    </div>
  );
};

export default UserCard;