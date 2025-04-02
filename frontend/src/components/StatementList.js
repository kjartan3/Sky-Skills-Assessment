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

  // Check if all statements on the current page belong to the same behavior
  const getCurrentBehaviourName = () => {
    const behaviourNames = new Set(currentStatements.map((s) => s.Behaviour.name));

    if (behaviourNames.size === 1) {
      return [...behaviourNames][0]; // Return the only behavior name
    }
    return null;
  };

  const currentBehaviourName = getCurrentBehaviourName();

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

  // Calculate average score for the current page if all statements have the same behavior
  const calculateAverageScoreForCurrentPage = () => {
    if (!currentBehaviourName) return null; // Only calculate if all questions have the same behavior

    const relevantStatements = currentStatements.filter((s) => s.Behaviour.name === currentBehaviourName);
    const relevantAnswers = relevantStatements
      .map((s) => answers[s.id])
      .filter((a) => a !== undefined); // Get only answered questions

    if (relevantAnswers.length === 0) return null; // Avoid division by zero

    const totalScore = relevantAnswers.reduce((sum, score) => sum + score, 0);
    return (totalScore / relevantAnswers.length).toFixed(2);
  };

  const averageScore = calculateAverageScoreForCurrentPage();

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  return (
    <div className="container">
    <h1>Assessment Statements</h1>
  
    {currentBehaviourName && <h2>Behavior: {currentBehaviourName}</h2>}
  
    {currentStatements.map((statement) => (
  <div key={statement.id}>
    <p><strong>Statement:</strong> {statement.text}</p>
    <div className="radio-container">
      {[1, 2, 3, 4, 5].map((value) => (
        <div key={value}>
          {/* Give each input a unique id to ensure proper association with the label */}
          <input
            type="radio"
            id={`statement-${statement.id}-value-${value}`} // Unique ID for each radio button
            name={`statement-${statement.id}`}
            value={value}
            checked={answers[statement.id] === value}
            onChange={() => handleAnswerChange(statement.id, value)}
          />
          <label htmlFor={`statement-${statement.id}-value-${value}`}>
            {value === 1 ? "Strongly Disagree" : 
             value === 2 ? "Disagree" :
             value === 3 ? "Neutral" :
             value === 4 ? "Agree" : "Strongly Agree"}
          </label>
        </div>
      ))}
    </div>
  </div>
))}

  
    <div>
      <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
      <button onClick={handleNext} disabled={Object.keys(answers).length < (currentPage + 1) * statementsPerPage}>
        {currentPage < Math.ceil(statements.length / statementsPerPage) - 1 ? "Next" : "Submit"}
      </button>
    </div>
  
    {averageScore && (
      <div className="average-score">
        <h2>Average Score for {currentBehaviourName}</h2>
        <p>{averageScore}</p>
      </div>
    )}
  </div>
  
      
  );
};

export default StatementList;
