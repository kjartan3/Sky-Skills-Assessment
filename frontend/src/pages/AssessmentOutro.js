import React from "react";
import { useNavigate } from "react-router-dom";

const AssessmentOutro = () => {
  const navigate = useNavigate();

  return (
    <div className="container-intro">
      <div className="content-wrapper">
        <h1>You're All Done!</h1>
        <br />
        <p>
          You've completed the Sky Skills Self-Reflection. Well done for taking the time to reflect on your strengths and development areas.
        </p>
        <br />
        <p>
          Your responses have been used to generate a personalised summary that highlights your top behavioural strengths, areas for growth, and tailored learning recommendations.
        </p>
        <br />
        <p>
          This summary is designed to support your ongoing development journey. You can use it to identify focus areas, explore learning resources, and have meaningful conversations with your manager or mentor.
        </p>
        <br />
        <p>
          Click below to view your reflection summary and take the next step in your development.
        </p>
        <br />
        <button className="start-button" onClick={() => navigate("/assessmentsummary")}>
          View My Summary
        </button>
      </div>
    </div>
  );
};

export default AssessmentOutro;
