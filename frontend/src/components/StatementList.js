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

  const getCurrentSkillName = () => {
    const skillNames = new Set(currentStatements.map((s) => s.Behaviour.Skill.name));
    return [...skillNames][0]; // Assuming all statements on the current page have the same skill
  };

  const currentSkillName = getCurrentSkillName();
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
      handleSubmit(); // Submit when the last page is reached
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  
  

  const totalStatements = statements.length;
  const answeredStatements = Object.keys(answers).length;
  const progressPercentage = totalStatements > 0 ? (answeredStatements / totalStatements) * 100 : 0;

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // 1. Format responses for submission
      const responsePayload = Object.entries(answers).map(([statementId, score]) => ({
        statementId: parseInt(statementId),
        score,
      }));

      // 2. Create a new assessment with responses
      const res = await fetch("http://localhost:5000/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: 1, responses: responsePayload }), // Static userId for now
      });

      
      if (res.status === 201) {
        // 3. Navigate to the summary page
        navigate("/assessmentsummary");
      } else {
        throw new Error("Failed to create assessment.");
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Something went wrong submitting your answers.");
    }
  };

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Display Skill Name above Behaviour */}
      {currentSkillName && <h2 className="skill-title">{currentSkillName}</h2>}
      {currentBehaviourName && <h2 className="behaviour-title">{currentBehaviourName}</h2>}

      {currentStatements.map((statement) => (
        <div key={statement.id} className="statement-container">
          <br />
          <p className="statement-style">
            <strong></strong> {statement.text}
          </p>
          <div className="radio-container">
            {[1, 2, 3, 4].map((value) => (
              <div key={value}>
                <input
                  type="radio"
                  id={`statement-${statement.id}-value-${value}`}
                  name={`statement-${statement.id}`}
                  value={value}
                  checked={answers[statement.id] === value}
                  onChange={() => handleAnswerChange(statement.id, value)}
                />
                <label htmlFor={`statement-${statement.id}-value-${value}`}>
                  {value === 1 ? "Not at all" :
                   value === 2 ? "Some of the time" :
                   value === 3 ? "Most of the time" : "All the time"}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="button-container">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={Object.keys(answers).length < (currentPage + 1) * statementsPerPage}
        >
          {currentPage < Math.ceil(statements.length / statementsPerPage) - 1
            ? "Next"
            : "Submit"}
        </button>
      </div>

      
      
    </div>
  );
};

export default StatementList;
