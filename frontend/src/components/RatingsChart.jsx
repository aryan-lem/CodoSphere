// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { useSelector } from 'react-redux';
// const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//         const { time,name, rating, rank } = payload[0].payload;
      
// const date = new Date(time* 1000);
// const monthYear = `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
// console.log(monthYear); // Outputs: 09/2023

//         return (
//             <div className="custom-tooltip">
//                 <p>{`Contest: ${name}`}</p>
//                 <p>{`Rating: ${rating}`}</p>
//                 <p>{`Rank: ${rank}`}</p>
//                 <style jsx>{`
//             .custom-tooltip {
//               border: 1px solid #ccc;
//               background-color: #fff;
//               padding: 10px;
//             }
//           `}</style>
//             </div>
//         );
//     }

//     return null;
// };
// const RatingChart = (props) => {
//     const [data, setData] = useState([]);
//     // const user = useSelector((state) => state.auth.user);
//     const user=props.user;

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
                
//                 const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${user.codeForcesHandle}`); // replace with your actual API endpoint
//                 if (response.data.status === 'OK') {
//                     const formattedData = response.data.result.map(contest => ({

//                         time: contest.ratingUpdateTimeSeconds,
//                         name:contest.contestName,

//                         rating: contest.newRating,
//                         rank: contest.rank
//                     }));
//                     setData(formattedData);
//                 }
//             } catch (error) {
//                 console.error('Error fetching the data', error);
//             }
//         };

//         fetchData();
//     }, [user]);
//     // Outputs: 09/2023

//     return (
//         <>
        
//         <ResponsiveContainer width="100%" height={400}>
//         {user&&
//         <div>
//             <h1>{user.codeForcesHandle}</h1>
//         </div>}
//             <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
           
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="monthYear" />
//                 <YAxis />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
//             </LineChart>
//         </ResponsiveContainer>
//         </>
//     );
// };

// export default RatingChart;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { time, name, rating, rank } = payload[0].payload;
        const date = new Date(time * 1000);
        const monthYear = `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;

        return (
            <div className="custom-tooltip">
                <p>{`Contest: ${name}`}</p>
                <p>{`Rating: ${rating}`}</p>
                <p>{`Rank: ${rank}`}</p>
                <style jsx>{`
                    .custom-tooltip {
                        border: 1px solid #ccc;
                        background-color: #fff;
                        padding: 10px;
                    }
                `}</style>
            </div>
        );
    }

    return null;
};

const RatingChart = (props) => {
    const [data, setData] = useState([]);
    const user = props.user;

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.codeForcesHandle) {
                setData([]); // Reset data when user or handle is not present
                return;
            }

            try {
                const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${user.codeForcesHandle}`);
                if (response.data.status === 'OK') {
                    const formattedData = response.data.result.map(contest => ({
                        time: contest.ratingUpdateTimeSeconds,
                        name: contest.contestName,
                        rating: contest.newRating,
                        rank: contest.rank
                    }));
                    setData(formattedData);
                }
            } catch (error) {
                console.error('Error fetching the data', error);
            }
        };

        fetchData();
    }, [user]);

    if (!user || !user.codeForcesHandle) {
        return null; // Do not render anything if user or codeForcesHandle is not present
    }

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <div>
                    <h1>{user.codeForcesHandle}</h1>
                </div>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(time) => {
                        const date = new Date(time * 1000);
                        return `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
                    }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default RatingChart;
