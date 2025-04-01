import { useState } from 'react';
import StatementList from '../components/StatementList';

const Assessment = () => {
    const [responses, setResponses] = useState({});

    // Function to handle changes in the response (called from StatementList)
    const handleResponseChange = (statementId, response) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [statementId]: response, // Update the response for the given statementId
        }));
    };

    return (
        <div>
            {/* Pass handleResponseChange as onResponseChange prop */}
            <StatementList onResponseChange={handleResponseChange} />
        </div>
    );
};

export default Assessment;

