// // src/components/TagPieChart.js
// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
// import { useSelector } from 'react-redux';

// const COLORS = [
//   '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#8800FE', '#00AA9F', '#BBFF28', '#8042FF', '#33AA6A'
// ];

// const fetchData = async (codeForcesHandle) => {
//   const response = await fetch(`https://codeforces.com/api/user.status?handle=${codeForcesHandle}`);
//   const data = await response.json();
//   return data.result.filter(submission => submission.verdict === 'OK');
// };

// const processChartData = (submissions) => {
//   const problemRatings = {};
//   const tagsCount = {};

//   submissions.forEach(submission => {
//     const { rating, tags } = submission.problem;

//     // Count problem ratings
//     if (rating) {
//       if (!problemRatings[rating]) problemRatings[rating] = 0;
//       problemRatings[rating] += 1;
//     }

//     // Count tags
//     tags.forEach(tag => {
//       if (!tagsCount[tag]) tagsCount[tag] = 0;
//       tagsCount[tag] += 1;
//     });
//   });

//   return {
//     problemRatings: Object.entries(problemRatings).map(([rating, count]) => ({ rating: parseInt(rating), count })),
//     tagsCount: Object.entries(tagsCount).map(([tag, count]) => ({ tag, count }))
//   };
// };

// const TagPieChart = (props) => {
//   const [data, setData] = useState([]);
//   // const user = useSelector((state) => state.auth.user);
//   const user=props.user;

//   useEffect(() => {
//     if (user && user.codeForcesHandle) {
//       const getData = async () => {
//         const submissions = await fetchData(user.codeForcesHandle);
//         const { tagsCount } = processChartData(submissions);
//         setData(tagsCount);
//       };
//       getData();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold text-center mb-4">Types of Problems Solved</h2>
//       <div className="flex justify-center">
//         <PieChart width={600} height={600}>
//           <Pie
//             data={data}
//             dataKey="count"
//             nameKey="tag"
//             cx="50%"
//             cy="50%"
//             outerRadius={200}
//             fill="#8884d8"
//             className="focus:outline-none"
//             // label
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>
//     </div>
//   );
// };

// export default TagPieChart;
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#8800FE', '#00AA9F', '#BBFF28', '#8042FF', '#33AA6A'
];

const fetchData = async (codeForcesHandle) => {
  const response = await fetch(`https://codeforces.com/api/user.status?handle=${codeForcesHandle}`);
  const data = await response.json();
  return data.result.filter(submission => submission.verdict === 'OK');
};

const processChartData = (submissions) => {
  const tagsCount = {};

  submissions.forEach(submission => {
    const { tags } = submission.problem;

    // Count tags
    tags.forEach(tag => {
      if (!tagsCount[tag]) tagsCount[tag] = 0;
      tagsCount[tag] += 1;
    });
  });

  return Object.entries(tagsCount).map(([tag, count]) => ({ tag, count }));
};

const TagPieChart = (props) => {
  const [data, setData] = useState([]);
  const user = props.user;

  useEffect(() => {
    const getData = async () => {
      if (!user || !user.codeForcesHandle) {
        setData([]); // Reset data when user or handle is not present
        return;
      }

      const submissions = await fetchData(user.codeForcesHandle);
      const tagsCount = processChartData(submissions);
      setData(tagsCount);
    };

    getData();
  }, [user]);

  if (!user || !user.codeForcesHandle) {
    return null; // Do not render anything if user or codeForcesHandle is not present
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Types of Problems Solved</h2>
      <div className="flex justify-center">
        <PieChart width={600} height={600}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="tag"
            cx="50%"
            cy="50%"
            outerRadius={200}
            fill="#8884d8"
            className="focus:outline-none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default TagPieChart;
