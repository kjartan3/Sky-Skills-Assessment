import { useEffect, useState } from "react";

const StatementList = ({ onResponseChange }) => {
    const [statements, setStatements] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const statementsPerPage = 4;

    useEffect(() => {
        // Fetch statements from the backend
        const fetchStatements = async () => {
            try {
                const response = await fetch("http://localhost:5000/statements"); // Adjust the URL if needed
                const data = await response.json();
                setStatements(data);
            } catch (error) {
                console.error("Error fetching statements:", error);
            }
        };

        fetchStatements();
    }, []);

    const startIndex = currentPage * statementsPerPage;
    const currentStatements = statements.slice(startIndex, startIndex + statementsPerPage);

    return (
        <div>
            <h2>Assessment Statements</h2>
            {currentStatements.length > 0 ? (
                currentStatements.map((statement) => (
                    <div key={statement.id}>
                        <p>{statement.text}</p>
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="agree"
                            onChange={() => onResponseChange(statement.id, "strongly-agree")}
                        />{" "}
                        Strongly Agree
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="neutral"
                            onChange={() => onResponseChange(statement.id, "agree")}
                        />{" "}
                        Agree
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="disagree"
                            onChange={() => onResponseChange(statement.id, "neutral")}
                        />{" "}
                        Neutral
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="disagree"
                            onChange={() => onResponseChange(statement.id, "disagree")}
                        />{" "}
                        Disagree
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="disagree"
                            onChange={() => onResponseChange(statement.id, "strongly-disagree")}
                        />{" "}
                        Strongly Disagree
                    </div>
                ))
            ) : (
                <p>Loading questions...</p>
            )}
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
