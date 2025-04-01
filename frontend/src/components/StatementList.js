import { useEffect, useState } from "react";

const StatementList = ({ onResponseChange }) => {
    const [statements, setStatements] = useState([]);

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

    return (
        <div>
            <h2>Assessment Statments</h2>
            {statements.length > 0 ? (
                statements.map((statement) => (
                    <div key={statement.id}>
                        <p>{statement.text}</p>
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="agree"
                            onChange={() => onResponseChange(statement.id, "agree")}
                        />{" "}
                        Agree
                        <input
                            type="radio"
                            name={`question-${statement.id}`}
                            value="neutral"
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
                    </div>
                ))
            ) : (
                <p>Loading questions...</p>
            )}
        </div>
    );
};

export default StatementList;
