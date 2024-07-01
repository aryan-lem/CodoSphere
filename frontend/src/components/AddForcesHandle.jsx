import React, { useState } from 'react';
import axios from 'axios';
const AddForcesHandle = () => {
    const [handle, setHandle] = useState('');
    const [verified, setVerified] = useState(false);
    const [submissionId, setSubmissionId] = useState('');
    const [startTime, setStartTime] = useState(null)
    const token = localStorage.getItem('token');
    const handleInputChange = (event) => {
        setHandle(event.target.value);
    };



    const handleVerify = () => {
        // Logic to verify the handle
        console.log('Verifying handle:', handle);
        setStartTime(Date.now());
        setVerified(true); // Set the verified state to true when handle is verified
    };

    const handleSubmissionIdChange = (event) => {
        setSubmissionId(event.target.value);
    };


    const handleSubmit = async () => {

        try {
            const response1 = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`)
            // Store the response data in a variable named 'response'
            let responseData = response1.data;
            const submittedHandle = responseData.result[0].author.members[0].handle;
            const fetchedId = responseData.result[0].id;
            const fetchedContestId = responseData.result[0].problem.contestId;
            const fetchedIndex = responseData.result[0].problem.index;
            const submittedTime = responseData.result[0].creationTimeSeconds;

            const timeDiff = submittedTime - startTime / 1000;

            if (submittedHandle == handle && fetchedId == submissionId && fetchedContestId == 1578 && fetchedIndex == 'C' && timeDiff <= 1200 && timeDiff>=0) {
                console.log(" Bato - Bati " + handle);

                console.log(timeDiff);

                const response = await axios.post(`http://localhost:5555/api/user/setCodeforcesHandle/${handle}`,{}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert(" Successfully Verified your handle ");

            }
            else {
                alert(" Can not Verify your handle ")
            }


        } catch (error) {
            console.error('Error fetching data:', error);
        }



    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <label
                htmlFor="codeforces-handle"
                className="block text-gray-700 text-sm font-bold mb-2"
            >
                Your Codeforces Handle
            </label>
            <input
                type="text"
                id="codeforces-handle"
                placeholder="Your Codeforces Handle"
                value={handle}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {!verified && <button
                onClick={handleVerify}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Verify
            </button>}

            {verified && (
                <div className="mt-6">
                    <p className="text-gray-700 mb-4">
                        Submit this question under 120 seconds from your given Codeforces handle.
                    </p>
                    <a
                        href={`https://codeforces.com/problemset/problem/1578/C`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Submit this question
                    </a>
                    <label
                        htmlFor="submission-id"
                        className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                    >
                        Submission ID
                    </label>
                    <input
                        type="text"
                        id="submission-id"
                        placeholder="Enter your Submission ID"
                        value={submissionId}
                        onChange={handleSubmissionIdChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {verified && <button
                        onClick={handleSubmit}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>}
                </div>
            )}
        </div>
    );
}

export default AddForcesHandle;
