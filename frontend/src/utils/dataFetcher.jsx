import { useSelector } from 'react-redux';

export const fetchData = async () => {
    const user = useSelector((state) => state.auth.user);
    
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${user.codeForcesHandle}`);
    const data = await response.json();
    return data.result.filter(submission => submission.verdict === 'OK');
  };
  
  export const processChartData = (submissions) => {
    const problemRatings = {};
    const tagsCount = {};
  
    submissions.forEach(submission => {
      const { rating, tags } = submission.problem;
  
      // Count problem ratings
      if (rating) {
        if (!problemRatings[rating]) problemRatings[rating] = 0;
        problemRatings[rating] += 1;
      }
  
      // Count tags
      tags.forEach(tag => {
        if (!tagsCount[tag]) tagsCount[tag] = 0;
        tagsCount[tag] += 1;
      });
    });
  
    return {
      problemRatings: Object.entries(problemRatings).map(([rating, count]) => ({ rating: parseInt(rating), count })),
      tagsCount: Object.entries(tagsCount).map(([tag, count]) => ({ tag, count }))
    };
  };