// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import ChatPreview from '../components/chatPreview';
// import ChatWindow from '../components/ChatWindow';
// import CreateGroupModal from '../components/CreateGroupModal';
// import 'tailwindcss/tailwind.css';

// const ChatPage = () => {
//   const token = localStorage.getItem('token');
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const user = useSelector((state) => state.auth.user);
  
//   const fetchChats = async () => {
//     try {
//       const response = await axios.get('http://localhost:5555/api/chat', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setChats(response.data);
//     } catch (error) {
//       console.error('Error fetching chats:', error);
//     }
//   };

//   const fetchFriends = async (query) => {
//     try {
//       const response = await axios.get(`http://localhost:5555/api/user/friends/search?q=${query}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error fetching friends:', error);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value) {
//       fetchFriends(e.target.value);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleStartChat = async (friend) => {
//     try {
//       const response = await axios.post('http://localhost:5555/api/chat', {
//         userId: friend._id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setChats((prevChats) => [...prevChats, response.data]);
//       setSelectedChat(response.data);
//       setSearchQuery('');
//       setSearchResults([]);
//     } catch (error) {
//       console.error('Error starting chat:', error.response ? error.response.data : error.message);
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, [token]);

//   return (
//     <>
//       {user && (
//         <div className="flex h-screen">
//           <aside className="w-1/4 bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
//             <div >
//                 <div className="flex justify-between items-center mb-4 ">
//                 <h2 className="text-2xl font-bold">Chats</h2>
//                 <button onClick={() => setShowModal(true)} className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 focus:outline-none hover:bg-blue-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                 </button>
//               </div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 placeholder="Search friends..."
//                 className="w-full p-2 border border-gray-300 rounded mb-4"
//               />
//             </div>
//             <div className="overflow-y-auto flex-1 space-y-2">
//               {searchQuery && searchResults.length > 0 ? (
//                 searchResults.map((friend) => (
//                   <div key={friend._id} onClick={() => handleStartChat(friend)} className="cursor-pointer">
//                     <ChatPreview chat={friend} />
//                   </div>
//                 ))
//               ) : (
//                 chats.map((chat) => (
//                   <div key={chat._id} onClick={() => setSelectedChat(chat)}>
//                     <ChatPreview chat={chat} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </aside>
//           <main className="flex-1 flex flex-col">
//             {selectedChat ? (
//               <ChatWindow chat={selectedChat} />
//             ) : (
//               <div className="flex-1 flex items-center justify-center">
//                 <p className="text-gray-500">Select a chat to start messaging</p>
//               </div>
//             )}
//           </main>
//           {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatPage;




import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ChatPreview from '../components/chatPreview';
import ChatWindow from '../components/ChatWindow';
import CreateGroupModal from '../components/CreateGroupModal';
import 'tailwindcss/tailwind.css';

const ChatPage = () => {
  const token = localStorage.getItem('token');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const user = useSelector((state) => state.auth.user);
  
  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:5555/api/chat', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchFriends = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5555/api/user/friends/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      fetchFriends(e.target.value);
    } else {
      setSearchResults([]);
    }
  };

  const handleStartChat = async (friend) => {
    try {
      const response = await axios.post('http://localhost:5555/api/chat', {
        userId: friend._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats((prevChats) => [...prevChats, response.data]);
      setSelectedChat(response.data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting chat:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  return (
    <>
      {user && (
        <div className="min-h-screen bg-custom-bg bg-cover bg-center flex">
          {/* Apply background image styling here */}
          <aside className="w-1/4 bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Chats</h2>
                <button onClick={() => setShowModal(true)} className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 focus:outline-none hover:bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search friends..."
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
              {searchQuery && searchResults.length > 0 ? (
                searchResults.map((friend) => (
                  <div key={friend._id} onClick={() => handleStartChat(friend)} className="cursor-pointer">
                    <ChatPreview chat={friend} />
                  </div>
                ))
              ) : (
                chats.map((chat) => (
                  <div key={chat._id} onClick={() => setSelectedChat(chat)}>
                    <ChatPreview chat={chat} />
                  </div>
                ))
              )}
            </div>
          </aside>
          <main className="flex-1 flex flex-col">
            {selectedChat ? (
              <ChatWindow chat={selectedChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            )}
          </main>
          {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
        </div>
      )}
    </>
  );
};

export default ChatPage;
