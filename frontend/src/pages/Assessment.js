import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../components/Assessment/ProgressBar";
import StatementGroup from "../components/Assessment/StatementGroup";
import NavigationButtons from "../components/Assessment/NavigationButtons";
import AssessmentIntro from "../components/Assessment/AssessmentIntro";

import "./Assessment.css";

const Assessment = ({ user }) => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [statements, setStatements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  
  const statementsPerPage = 6;

  const skillColors = {
    Welcoming: "#FF8C00",
    Creative: "#FF00A0",
    Simplifying: "#8C28FF",
    "Doing the right thing": "#19A0FF"
  };

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/statements`, {
          withCredentials: true,
        });
        setStatements(res.data);
        sessionStorage.setItem("statements", JSON.stringify(res.data));
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
      if (!user || !user.userId) {
        throw new Error("User information is missing");
      }

      const responsePayload = Object.entries(answers).map(([statementId, score]) => ({
        statementId: parseInt(statementId),
        score,
      }));

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/assessments`,
        {
          userId: user.userId,
          responses: responsePayload,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  const currentStatements = statements.slice(
    currentPage * statementsPerPage,
    (currentPage + 1) * statementsPerPage
  );

  const progressPercentage =
    statements.length > 0 ? (Object.keys(answers).length / statements.length) * 100 : 0;

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  if (showIntro) {
    return <AssessmentIntro onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="container">
      <ProgressBar progress={progressPercentage} />
      <StatementGroup
        skillName={currentStatements[0]?.Content?.Behaviour?.Skill?.name}
        behaviourName={currentStatements[0]?.Content?.Behaviour?.name}
        skillColor={skillColors[currentStatements[0]?.Content?.Behaviour?.Skill?.name] || "#b0b0b0"}
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


