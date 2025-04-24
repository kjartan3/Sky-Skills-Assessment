import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/Assessment/ProgressBar";
import StatementGroup from "../components/Assessment/StatementGroup";
import NavigationButtons from "../components/Assessment/NavigationButtons";
import './Assessment.css'
import GetUserId from "../components/Auth/GetUserId";

const Assessment = () => {
  const navigate = useNavigate();
  const [statements, setStatements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const statementsPerPage = 4;
  const userId = GetUserId()
  const token = sessionStorage.getItem('token');

  if (!userId) {
    alert('User is not authenticted')
    navigate('/auth')
  }
 
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
      } finally {
        setLoading(false)
      }
    };

    fetchStatements();
  }, []);

  // Get current page statements
  const currentStatements = statements.slice(currentPage * statementsPerPage, (currentPage + 1) * statementsPerPage);

  // Check if all statements on the current page belong to the same behavior
  const getCurrentBehaviourName = () => {
    const names = new Set(currentStatements.map((s) => s.Behaviour.name));
    return names.size === 1 ? [...names][0] : null;
   
  };

  const getCurrentSkillName = () => {
    const names = new Set(currentStatements.map((s) => s.Behaviour.Skill.name));
    return [...names][0]; // Assuming all statements on the current page have the same skill
  };



  const handleAnswerChange = (statementId, value) => {
    const updatedAnswers = {...answers, [statementId]: value};
    setAnswers(updatedAnswers);
    sessionStorage.setItem("answers", JSON.stringify(updatedAnswers)); // Save updated answers to sessionStorage
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(statements.length / statementsPerPage) - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      handleSubmit(); // Submit when the last page is reached
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };


  // Handle form submission
  const handleSubmit = async () => {
    try {
      // 1. Format responses for submission
      console.log("Submitting to: ", "http://localhost:5000/assessments")
      console.log("using token:", token)
      const responsePayload = Object.entries(answers).map(([statementId, score]) => ({
        statementId: parseInt(statementId),
        score,
      }));

      // 2. Create a new assessment with responses
      const res = await fetch("http://localhost:5000/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, responses:responsePayload }), 
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

 
  const progressPercentage = statements.length > 0 ? (Object.keys(answers).length / statements.length) * 100 : 0;

  if (loading) {
    return <div>Loading statements...</div>;
  }

  if (statements.length === 0) {
    return <div>No statements available. Please try again later.</div>;
  }

  return (
    <div className="container">
      < ProgressBar progress={progressPercentage}/>
      
      <StatementGroup 
        skillName={getCurrentSkillName()}
        behaviourName={getCurrentBehaviourName()}
        statements={currentStatements}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
      
      <NavigationButtons 
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirstPage={currentPage===0}
        isLastPage={currentPage === Math.ceil(statements.length / statementsPerPage) - 1}
        canProceed={
          Object.keys(answers).length >= (currentPage + 1) * statementsPerPage
        }
      />
      
      
    </div>
  );
};

export default Assessment;
