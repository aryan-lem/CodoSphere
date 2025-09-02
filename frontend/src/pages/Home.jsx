import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Post from '../components/Post';
import CreatePostForm from '../components/CreatePostForm';
import { ClipLoader } from 'react-spinners';

const Home = () => {
    const token = localStorage.getItem('token');
    const user = useSelector((state) => state.auth.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5555';

    useEffect(() => {
        const getAllPost = async () => {
            try {
                setLoading(true);
                let allPosts = [];
                for (let i = 0; i < user.friends.length; i++) {
                    const fid = user.friends[i];
                    const url = `${apiUrl}/api/post/${fid}/posts`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    allPosts = allPosts.concat(response.data);
                    console.log(allPosts);
                }
                setPosts(allPosts);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        if (user && user.friends.length > 0) {
            getAllPost();
        } else {
            setLoading(false);
        }
    }, [user, token]);

    return (
        <div className="bg-gradient-to-b from-blue-100 to-slate-50 min-h-screen bg-custom-bg overflow-x-hidden">
            {!user && (
                <div className="flex items-center justify-center min-h-screen">
                    <ClipLoader color="#3b82f6" loading={loading} size={100} />
                </div>
            )}
            {user && <h1 className="text-center text-2xl my-4 text-slate-800 font-bold">Welcome {user.firstName} {user.lastName}</h1>}
            <CreatePostForm />
            <div>
                {/* Render posts */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <ClipLoader color="#3b82f6" loading={loading} size={100} />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id || post.id}>
                            <Post post={post} />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center p-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 text-center">
                            <h3 className="text-lg font-medium text-slate-800 mb-2">No posts yet</h3>
                            <p className="text-slate-600">Connect with more users to see their posts here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;