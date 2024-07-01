import React, { useState } from 'react';
import axios from 'axios';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const token = localStorage.getItem('token');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5555/api/user/searchUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          query: searchQuery,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddUser = (user) => {
    
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleCreateGroupChat = async () => {
    if (!groupName || selectedUsers.length < 2) {
      // Validate group name and selected users
      console.error('Please provide a group name and select at least two users.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5555/api/chat/group',
        {
          name: groupName,
          users: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Group chat created:', response.data);
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };


  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Create Group Chat</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
        />
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search Users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-2"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Search</button>
        </div>
        <ul className="max-h-32 overflow-y-auto mb-4">
          {searchResults.map(user => (
            <li key={user._id} className="flex items-center justify-between border-b border-gray-200 py-2">
              <span>{user.firstName} {user.lastName}</span>
              <button onClick={() => handleAddUser(user)} className="px-4 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add</button>
            </li>
          ))}
        </ul>
        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Users:</h3>
          <ul className="mb-4">
            {selectedUsers.map(user => (
              <li key={user._id}>{user.firstName} {user.lastName}</li>
            ))}
          </ul>
          <button onClick={handleCreateGroupChat} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Create Group Chat</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
