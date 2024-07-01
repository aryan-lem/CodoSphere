import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector for accessing Redux store
import UserCard from "../components/UserCard";
import RatingChart from '../components/RatingsChart';
import AddForcesHandle from "../components/AddForcesHandle";
import TagPieChart from '../components/TagPieChart';
import RatVsProb from '../components/RatVsProb';

const Dashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const loggedInUser = useSelector((state) => state.auth.user); // Get logged-in user from Redux store
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/user/getUserObjId/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full md:col-span-1 lg:col-span-1 flex justify-center">
          <UserCard user={user} setUser={setUser} />
        </div>
        
        <div className="col-span-full md:col-span-2 lg:col-span-2">
          <div className="flex flex-wrap justify-center gap-6">
            <RatingChart user={user}/>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <TagPieChart user={user}/>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <RatVsProb user={user}/>
          </div>
        </div>
      </div>

      {user && loggedInUser && user._id === loggedInUser._id && !user.codeForcesHandle && (
        <div className="mt-8 flex justify-center">
          <AddForcesHandle />
        </div>
      )}
    </div>
  );
};

export default Dashboard;