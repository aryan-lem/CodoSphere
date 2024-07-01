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

    useEffect(() => {
        const getAllPost = async () => {
            try {
                setLoading(true);
                let allPosts = [];
                for (let i = 0; i < user.friends.length; i++) {
                    const fid = user.friends[i];
                    const url = `http://localhost:5555/api/post/${fid}/posts`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}` // Attach JWT token to the request
                        }
                    });
                    allPosts = allPosts.concat(response.data);
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
        <div className="bg-custom-bg bg-cover bg-center bg-fixed min-h-screen overflow-hidden">
            {!user && (
                <div className="flex items-center justify-center min-h-screen">
                    <ClipLoader color="#00008B" loading={loading} size={100} />
                </div>
            )}
            {user && <h1 className="text-center text-2xl my-4 text-white font-bold">Welcome {user.firstName} {user.lastName}</h1>}
            <CreatePostForm />
            <div>
                {/* Render posts */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <ClipLoader color="#00008B" loading={loading} size={100} />
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id}>
                            <Post post={post} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
