import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StatementList.css";

const StatementList = () => {
  const navigate = useNavigate();
  const [statements, setStatements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const statementsPerPage = 4;

  // Fetch statements
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch("http://localhost:5000/statements");
        const data = await response.json();
        setStatements(data);
        sessionStorage.setItem("statements", JSON.stringify(data)); // Save to sessionStorage
      } catch (error) {
        console.error("Error fetching statements:", error);
      }
    };

    fetchStatements();
    setLoading(false);
  }, []);

  // Get current page statements
  const currentStatements = statements.slice(currentPage * statementsPerPage, (currentPage + 1) * statementsPerPage);

  const handleAnswerChange = (statementId, value) => {
    const updatedAnswers = {
      ...answers,
      [statementId]: value,
    };
    setAnswers(updatedAnswers);
    sessionStorage.setItem("answers", JSON.stringify(updatedAnswers)); // Save updated answers to sessionStorage
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(statements.length / statementsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/results"); // Navigate to results page after the last statement
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculateAverageScore = () => {
    const totalScore = Object.values(answers).reduce((acc, score) => acc + score, 0);
    return totalScore / Object.values(answers).length;
  };

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  return (
    <div className="container">
      <h1>Assessment Statements</h1>
      {currentStatements.map((statement) => (
        <div key={statement.id}>
          <h2>Behavior: {statement.Behaviour.name}</h2> {/* Display behavior name */}
          <p><strong>Statement:</strong> {statement.text}</p>
          <div className="radio-container">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`statement-${statement.id}`}
                  value={value}
                  checked={answers[statement.id] === value}
                  onChange={() => handleAnswerChange(statement.id, value)}
                />
                {value === 1 ? "Strongly Disagree" : 
                 value === 2 ? "Disagree" :
                 value === 3 ? "Neutral" :
                 value === 4 ? "Agree" : "Strongly Agree"}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div>
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={Object.keys(answers).length < (currentPage + 1) * statementsPerPage}>
          {currentPage < Math.ceil(statements.length / statementsPerPage) - 1 ? "Next" : "Submit"}
        </button>
      </div>
      <div>
        {Object.keys(answers).length > 0 && (
          <p>Average Score: {calculateAverageScore().toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default StatementList;
