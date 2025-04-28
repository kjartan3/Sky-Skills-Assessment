import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/Assessment/ProgressBar";
import StatementGroup from "../components/Assessment/StatementGroup";
import NavigationButtons from "../components/Assessment/NavigationButtons";
import './Assessment.css';

const Assessment = ({ user }) => {
  const navigate = useNavigate();
  const [statements, setStatements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const statementsPerPage = 4;

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch("http://localhost:5000/statements", {
          credentials: 'include',
        });
        const data = await response.json();
        setStatements(data);
        sessionStorage.setItem("statements", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching statements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!user || !user.id) {
        throw new Error("User information is missing");
      }

      const responsePayload = Object.entries(answers).map(([statementId, score]) => ({
        statementId: parseInt(statementId),
        score,
      }));

      const res = await fetch("http://localhost:5000/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, responses: responsePayload }),
      });

      if (res.status === 201) {
        navigate("/assessmentsummary");
      } else {
        throw new Error("Failed to create assessment.");
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Something went wrong submitting your answers.");
    }
  };

  const currentStatements = statements.slice(currentPage * statementsPerPage, (currentPage + 1) * statementsPerPage);
  const progressPercentage = statements.length > 0 ? (Object.keys(answers).length / statements.length) * 100 : 0;

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  return (
    <div className="container">
      <ProgressBar progress={progressPercentage} />

      <StatementGroup
        skillName={currentStatements[0]?.Behaviour.Skill.name}
        behaviourName={currentStatements[0]?.Behaviour.name}
        statements={currentStatements}
        answers={answers}
        onAnswerChange={(statementId, value) => {
          const updatedAnswers = { ...answers, [statementId]: value };
          setAnswers(updatedAnswers);
          sessionStorage.setItem("answers", JSON.stringify(updatedAnswers));
        }}
      />

      <NavigationButtons
        onPrevious={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        onNext={() => {
          if (currentPage < Math.ceil(statements.length / statementsPerPage) - 1) {
            setCurrentPage((prev) => prev + 1);
          } else {
            handleSubmit();
          }
        }}
        isFirstPage={currentPage === 0}
        isLastPage={currentPage === Math.ceil(statements.length / statementsPerPage) - 1}
        canProceed={Object.keys(answers).length >= (currentPage + 1) * statementsPerPage}
      />
    </div>
  );
};

export default Assessment;
