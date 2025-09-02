import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
    const [isFriend, setIsFriend] = useState(user.friends.includes(post.userId));
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [comments, setComments] = useState(post.comments);
    const [replyingTo, setReplyingTo] = useState(null);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

    const handleClickLike = async () => {
        try {
            const url = `${apiUrl}/api/post/${post._id}/like`;
            const response = await axios.patch(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setIsLiked(!isLiked);
                setLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
            }
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    const handleAddRemoveFriend = async () => {
        try {
            const url = `${apiUrl}/api/user/${user._id}/${post.userId}`;
            const response = await axios.patch(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setIsFriend(!isFriend);
            }
        } catch (error) {
            console.error('Error adding/removing friend:', error);
        }
    };

    const handleNavigateToDashboard = () => {
        navigate(`/dashboard/${post.userId}`);
    };

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleShowComments = () => {
        setShowCommentsModal(true);
    };

    const handleHideComments = () => {
        setShowCommentsModal(false);
        setReplyingTo(null);
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/post/${post._id}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        if (showCommentsModal) {
            fetchComments();
        }
    }, [showCommentsModal]);

    const handleCreateComment = async () => {
        if (!newCommentContent.trim()) return;
        
        try {
            const response = await axios.post(`${apiUrl}/api/post/${post._id}/comment`, {
                content: newCommentContent,
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                parentId: replyingTo ? replyingTo._id : null,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewCommentContent('');
            setReplyingTo(null);
            fetchComments();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleReply = (comment) => {
        setReplyingTo(comment);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const renderComments = (parentId = null, depth = 0) => {
        const filteredComments = comments.filter(comment => comment.parentId === parentId);

        if (filteredComments.length === 0) {
            return null;
        }

        return filteredComments.map(comment => (
            <div key={comment._id} className={`bg-blue-100 p-3 rounded-md mb-3 border border-blue-200 ${depth > 0 ? `ml-${depth * 4}` : ''} ${replyingTo === comment ? 'border-l-2 border-blue-400 pl-3' : ''}`}>
                <div className="flex items-center mb-1">
                    <span className="font-medium text-slate-800">{comment.firstName} {comment.lastName}</span>
                    <span className="text-xs text-slate-500 ml-2">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 text-sm mb-2">{comment.content}</p>
                <button 
                    onClick={() => handleReply(comment)} 
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                    Reply
                </button>
                <div className="mt-3">
                    {renderComments(comment._id, depth + 1)}
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-gradient-to-b from-blue-100 to-slate-50 shadow-sm border border-blue-200 rounded-xl overflow-hidden mx-4 md:mx-auto my-8 max-w-md md:max-w-2xl transition-all duration-200 hover:shadow-md">
            <div className="p-5">
                <div className="flex items-center mb-4">
                    <img 
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 mr-3" 
                        src={post.picturePath || "https://ui-avatars.com/api/?name=" + post.firstName + "+" + post.lastName + "&background=bfdbfe&color=1e3a8a"} 
                        alt="avatar" 
                    />
                    <div>
                        <div className="flex items-center">
                            <h2 
                                className="font-semibold text-slate-800 hover:text-blue-700 cursor-pointer"
                                onClick={handleNavigateToDashboard}
                            >
                                {post.firstName + " " + post.lastName}
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500">{formattedDate}</p>
                    </div>
                </div>
                
                <div className="mb-4">
                    <p className="text-slate-700">{post.description}</p>
                </div>
                
                {post.picturePath && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                            src={post.picturePath} 
                            alt="Post attachment" 
                            className="w-full h-auto"
                        />
                    </div>
                )}
                
                <div className="flex items-center pt-3 border-t border-blue-200">
                    <button 
                        className="flex items-center mr-6 group"
                        onClick={handleClickLike}
                    >
                        <div className={`p-1.5 rounded-full ${isLiked ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'} transition-colors duration-200`}>
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span className={`text-sm ${isLiked ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'} transition-colors duration-200`}>{likes}</span>
                    </button>
                    
                    <button 
                        className="flex items-center group"
                        onClick={handleShowComments}
                    >
                        <div className="p-1.5 rounded-full text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors duration-200">{comments.length}</span>
                    </button>
                </div>
            </div>
            
            {showCommentsModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b border-blue-200 flex items-center justify-between">
                            <h2 className="font-medium text-lg text-slate-800">Comments</h2>
                            <button 
                                onClick={handleHideComments} 
                                className="p-1 rounded-full hover:bg-blue-100 text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 bg-blue-50">
                            {comments.length > 0 ? (
                                renderComments()
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    No comments yet. Be the first to comment!
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white border-t border-blue-200">
                            {replyingTo && (
                                <div className="mb-2 flex items-center justify-between bg-blue-100 p-2 rounded-md">
                                    <span className="text-xs text-slate-600">
                                        Replying to <span className="font-medium">{replyingTo.firstName} {replyingTo.lastName}</span>
                                    </span>
                                    <button 
                                        onClick={() => setReplyingTo(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            
                            <div className="flex">
                                <input 
                                    type="text" 
                                    value={newCommentContent} 
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    placeholder={replyingTo ? "Write a reply..." : "Add a comment..."} 
                                    className="flex-1 rounded-l-md border border-blue-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
                                />
                                <button 
                                    onClick={handleCreateComment}
                                    disabled={!newCommentContent.trim()} 
                                    className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md ${!newCommentContent.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Import the useHistory hook

// const Post = ({ post }) => {
//     const navigate = useNavigate(); // Initialize useHistory hook
//     const user = useSelector((state) => state.auth.user);
//     const [likes, setLikes] = useState(post.likes.length);
//     const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
//     const [isFriend, setIsFriend] = useState(user.friends.includes(post.userId));
//     const [showCommentsModal, setShowCommentsModal] = useState(false);
//     const [newCommentContent, setNewCommentContent] = useState('');
//     const [comments, setComments] = useState(post.comments);
//     const [replyingTo, setReplyingTo] = useState(null); // Keep track of the comment being replied to
//     const token = localStorage.getItem('token');
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

//     const handleClickLike = async () => {
//         try {
//             const url = `${apiUrl}/api/post/${post._id}/like`;
//             const response = await axios.patch(url, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             if (response.status === 200) {
//                 setIsLiked(!isLiked);
//                 setLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
//             }
//         } catch (error) {
//             console.error('Error liking the post:', error);
//         }
//     };

//     const handleAddRemoveFriend = async () => {
//         try {
//             const url = `${apiUrl}/api/user/${user._id}/${post.userId}`;
//             const response = await axios.patch(url, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             if (response.status === 200) {
//                 setIsFriend(!isFriend);
//             }
//         } catch (error) {
//             console.error('Error adding/removing friend:', error);
//         }
//     };

//     const handleNavigateToDashboard = () => {
//     navigate(`/dashboard/${post.userId}`);
//     };

//     const buttonStyle = {
//         color: 'black',
//         cursor: 'pointer',
//         marginLeft: '5px',
//     };

//     const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//     const ms = Date.now() - new Date("2024-04-14T20:17:27.310Z");
//     const hrs = ms / 36e5;
//     const timeAgo = hrs < 24 ? `${Math.round(hrs)} hr` : hrs < 168 ? `${Math.round(hrs / 24)} d` : hrs < 720 ? `${Math.round(hrs / 168)} w` : hrs < 8760 ? `${Math.round(hrs / 720)} mo` : `${Math.round(hrs / 8760)} yr`;

//     const handleShowComments = () => {
//         setShowCommentsModal(true);
//     };

//     const handleHideComments = () => {
//         setShowCommentsModal(false);
//         setReplyingTo(null);
//     };

//     const fetchComments = async () => {
//         try {
//             const response = await axios.get(`${apiUrl}/api/post/${post._id}/comments`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setComments(response.data.comments);
//         } catch (error) {
//             console.error('Error fetching comments:', error);
//         }
//     };

//     useEffect(() => {
//         if (showCommentsModal) {
//             fetchComments();
//         }
//     }, [showCommentsModal]);

//     const handleCreateComment = async () => {
//         try {
//             const response = await axios.post(`${apiUrl}/api/post/${post._id}/comment`, {
//                 content: newCommentContent,
//                 userId: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 parentId: replyingTo ? replyingTo._id : null,
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setNewCommentContent('');
//             setReplyingTo(null);
//             fetchComments();
//         } catch (error) {
//             console.error('Error creating comment:', error);
//         }
//     };

//     const handleReply = (comment) => {
//         setReplyingTo(comment);
//         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
//     };

//     const renderComments = (parentId = null, depth = 0) => {
//         const filteredComments = comments.filter(comment => comment.parentId === parentId);

//         if (filteredComments.length === 0) {
//             return null;
//         }

//         return filteredComments.map(comment => (
//             <div key={comment._id} className={`bg-gray-200 p-2 rounded-md mb-2 ${depth > 0 ? `ml-${depth * 2}` : ''} ${replyingTo === comment ? 'border-l-2 border-blue-500 pl-2' : ''}`}>
//                 <b><p className="text-black">{comment.firstName} {comment.lastName}</p></b>
//                 <p className="text-gray-800">{comment.content}</p>
//                 <button onClick={() => handleReply(comment)} className="text-blue-500 text-sm">Reply</button>
//                 {/* Add white space between comments and replies */}
//                 <div style={{ marginTop: '10px' }} />
//                 {renderComments(comment._id, depth + 1)}
//             </div>
//         ));
//     };

//     return (
//         <div className="flex bg-blue-300 shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl">
//             <div className="flex items-start px-4 py-6">
//                 <img className="w-12 h-12 rounded-full object-cover mr-4 shadow" src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="avatar" />
//                 <div className="">
//                     <div className="flex items-center ">
//                         <h2 className="text-lg font-semibold text-gray-900 -mt-1" onClick={handleNavigateToDashboard} style={{ cursor: 'pointer' }}>
//                             {post.firstName + " " + post.lastName}
//                         </h2>
//                         {/* <button style={{ color: 'black', cursor: 'pointer', marginLeft: '5px' }} onClick={handleAddRemoveFriend}>
//                             {isFriend ? <FaUserMinus /> : <FaUserPlus />}
//                         </button> */}
//                     </div>
//                     <p className="text-gray-700">{formattedDate} </p>
//                     <img src={post.picturePath} alt="postPic" />
//                     <p className="mt-3 text-gray-700 text-sm">{post.description}</p>
//                     <div className="mt-4 flex items-center">
//                         <div style={{ marginRight: '10px' }}>
//                             <svg fill={isLiked ? 'red' : 'none'} viewBox="0 0 24 24" className="w-6 h-6 mr-1 cursor-pointer" onClick={handleClickLike} stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                             </svg>
//                             <span>{likes}</span>
//                         </div>
//                         <div style={{ marginRight: '10px' }} className="cursor-pointer" onClick={handleShowComments}>
//                             <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 mr-1" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
//                             </svg>
//                             <span>{comments.length}</span>
//                         </div>
//                         {showCommentsModal && (
//                             <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
//                                 <div className="bg-white rounded-lg p-4 w-3/4">
//                                     <div className="flex justify-between mb-4">
//                                         <h2 className="text-lg font-semibold">Comments</h2>
//                                         <button onClick={handleHideComments} className="text-blue-500 hover:text-blue-700">Close</button>
//                                     </div>
//                                     <div className="overflow-y-auto max-h-80">
//                                         {renderComments()}
//                                     </div>
//                                     <div className="mt-4">
//                                         <input type="text" value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} placeholder="Add a comment..." className="w-full border rounded-md py-2 px-3" />
//                                         <button onClick={handleCreateComment} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Post</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Post;