import { useEffect, useState } from "react";

const StatementList = ({ onResponseChange }) => {
    const [statements, setStatements] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [responses, setResponses] = useState({});
    const statementsPerPage = 4;

    const responseValues = {
        "strongly-disagree": 1,
        "disagree": 2,
        "neutral": 3,
        "agree": 4,
        "strongly-agree": 5,
    };

    // Save responses to localStorage and update state
    const saveResponse = (statementId, response) => {
        const updatedResponses = { ...responses, [statementId]: response };
        setResponses(updatedResponses);
        localStorage.setItem("responses", JSON.stringify(updatedResponses)); // Save to localStorage
    };

    // Fetch statements from the backend
    useEffect(() => {
        const fetchStatements = async () => {
            try {
                const response = await fetch("http://localhost:5000/statements");
                const data = await response.json();
                setStatements(data);
            } catch (error) {
                console.error("Error fetching statements:", error);
            }
        };

        fetchStatements();
        const storedResponses = JSON.parse(localStorage.getItem("responses")) || {};
        setResponses(storedResponses); // Load stored responses
    }, []);

    // Function to calculate average score for a behavior
    const calculateAverageScore = (behaviourId) => {
        const behaviourStatements = statements.filter(statement => statement.Behaviour.id === behaviourId);

        if (behaviourStatements.length !== 4) {
            return 0;
        }

        const behaviourResponses = behaviourStatements.map(statement => responses[statement.id]);

        const validResponses = behaviourResponses.filter(response => response !== undefined);

        if (validResponses.length === 4) {
            const totalScore = validResponses.reduce((acc, response) => acc + responseValues[response], 0);
            return totalScore / validResponses.length;
        }

        return 0;
    };

    // Group statements by behavior for pagination
    const startIndex = currentPage * statementsPerPage;
    const currentStatements = statements.slice(startIndex, startIndex + statementsPerPage);

    return (
        <div>
            <h2>Assessment Statements</h2>
            {currentStatements.length > 0 ? (
                <>
                    <h3>Behaviour: {currentStatements[0].Behaviour.name}</h3>
                    {currentStatements.map((statement) => (
                        <div key={statement.id}>
                            <p>{statement.text}</p>
                            {["strongly-agree", "agree", "neutral", "disagree", "strongly-disagree"].map((response) => (
                                <label key={response}>
                                    <input
                                        type="radio"
                                        name={`question-${statement.id}`}
                                        value={response}
                                        checked={responses[statement.id] === response}
                                        onChange={() => {
                                            saveResponse(statement.id, response);
                                            onResponseChange(statement.id, response); // Ensure onResponseChange is called
                                        }}
                                    />
                                    {response.replace("-", " ").toUpperCase()}
                                </label>
                            ))}
                        </div>
                    ))}
                </>
            ) : (
                <p>Loading questions...</p>
            )}

            {/* Display the average score */}
            <div>
                {currentStatements.length > 0 && (
                    <p>
                        Average score for {currentStatements[0].Behaviour.name}:{" "}
                        {calculateAverageScore(currentStatements[0].Behaviour.id).toFixed(2)}
                    </p>
                )}
            </div>

            {/* Navigation */}
            <div>
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <button
                    disabled={currentPage >= Math.ceil(statements.length / statementsPerPage) - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StatementList;


