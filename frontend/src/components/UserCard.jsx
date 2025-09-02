import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserPlus, FaUserMinus, FaMapMarkerAlt, FaBriefcase, FaEnvelope, FaUsers, FaEye, FaChartLine } from 'react-icons/fa';

const UserCard = ({ user, setUser }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [isFriend, setIsFriend] = useState(false);
  const [imageError, setImageError] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

  useEffect(() => {
    if (user) {
      setIsFriend(user.friends.includes(loggedInUser?._id));
      setImageError(false); // Reset image error state when user changes
    }
  }, [user, loggedInUser]);

  const handleAddRemoveFriend = async () => {
    try {
      const response = await axios.patch(`${apiUrl}/api/user/${loggedInUser._id}/${user._id}`);
      const updatedFriends = response.data;
      dispatch({ type: 'UPDATE_FRIENDS', payload: updatedFriends });
      setIsFriend(!isFriend);
    } catch (error) {
      console.error('Error adding/removing friend:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  const generateBackgroundColor = () => {
    if (!user) return "#bfdbfe";
    
    // Generate a consistent color based on user's name
    const name = user.firstName + user.lastName;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to hexadecimal
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    // Ensure it's in the blue family for consistency with the theme
    // Mix the generated color with blue
    return color;
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-200 h-32 w-32 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-3 w-full">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-xl overflow-hidden w-full max-w-md transform transition hover:shadow-xl duration-300">
      {/* Header Banner */}
      <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      
      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex justify-between">
          <div className="flex-shrink-0 -mt-12">
            {!imageError && user.picturePath ? (
              <img
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                src={user.picturePath}
                alt={`${user.firstName} ${user.lastName}`}
                onError={handleImageError}
              />
            ) : (
              <div 
                className="h-28 w-28 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-white"
                style={{ 
                  backgroundColor: generateBackgroundColor(), 
                  backgroundImage: `linear-gradient(135deg, ${generateBackgroundColor()}, rgba(59, 130, 246, 0.8))`
                }}
              >
                {getInitials()}
              </div>
            )}
          </div>
          
          {loggedInUser?._id !== user?._id && (
            <button 
              onClick={handleAddRemoveFriend}
              className={`mt-4 px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                isFriend 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {isFriend ? (
                <>
                  <FaUserMinus /> <span>Remove Friend</span>
                </>
              ) : (
                <>
                  <FaUserPlus /> <span>Add Friend</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* User Info */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {user.firstName} {user.lastName}
          </h2>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-slate-600">
              <FaEnvelope className="mr-2 text-blue-500" />
              <span>{user.email}</span>
            </div>
            
            {user.location && (
              <div className="flex items-center text-slate-600">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user?.occupation && (
              <div className="flex items-center text-slate-600">
                <FaBriefcase className="mr-2 text-blue-500" />
                <span>{user.occupation}</span>
              </div>
            )}
          </div>
          
          {/* Stats Section */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-blue-100 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <FaUsers className="mr-1" />
              </div>
              <p className="text-xl font-semibold text-slate-800">{user.friends?.length || 0}</p>
              <p className="text-xs text-slate-500">Friends</p>
            </div>
            
            {typeof user.viewedProfile === 'number' && (
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <FaEye className="mr-1" />
                </div>
                <p className="text-xl font-semibold text-slate-800">{user.viewedProfile}</p>
                <p className="text-xs text-slate-500">Profile Views</p>
              </div>
            )}
            
            {typeof user.impressions === 'number' && (
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <FaChartLine className="mr-1" />
                </div>
                <p className="text-xl font-semibold text-slate-800">{user.impressions}</p>
                <p className="text-xs text-slate-500">Impressions</p>
              </div>
            )}
          </div>
          
          {/* CodeForces Handle */}
          {user.codeForcesHandle && (
            <div className="mt-6 bg-blue-100 rounded-lg p-3 flex items-center">
              <img 
                src="https://codeforces.org/favicon.ico" 
                alt="CodeForces" 
                className="w-5 h-5 mr-2"
                onError={(e) => {e.target.style.display = 'none'}}
              />
              <div>
                <p className="text-xs text-blue-600 font-medium">CODEFORCES HANDLE</p>
                <p className="text-slate-800 font-medium">{user.codeForcesHandle}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;