import React from "react";
import "../../pages/Assessment.css"; // optional CSS file

const AssessmentIntro = ({ onStart }) => {
  return (
    <div className="container-intro">
        <div className="content-wrapper">
            <h1>Welcome to the Sky Skills Self-Assessment</h1>
            <br />
            <p>
              This assessment is designed to help you reflect on your strengths and development areas across a range of skills that are essential for success at Sky. These skills — such as curiosity, communication, resilience, and innovation — are grounded in both the Sky Skills Framework and the Essential Skills Framework, which together highlight the behaviours, mindsets, and capabilities that drive personal and professional growth.
            </p>
            <br />
            <p>
              Each skill includes a short statement to guide your thinking. These statements combine what the skill means at Sky with practical behaviours that show how the skill is demonstrated in action.
              As you assess yourself, please keep the following in mind:  
            </p>
            <br />
            <ul>
              <li><b>Be honest and reflective:</b> This is a tool for your development, not a test. The more accurately you assess yourself, the more useful your insights will be.</li>
              <li><b>Think about real examples:</b> Consider how often and how confidently you demonstrate each skill in your day-to-day work or life.</li>
              <li><b>Use the guidance statements:</b> These are there to help you interpret each skill in context and understand what good looks like.</li>
              <li><b>Consider your environment:</b> Some skills may be easier or harder to demonstrate depending on your role, team, or experience. That’s okay—this is about where you are now, not where you think you should be.</li>
            </ul>
            <br />
            <p>   
              By completing this assessment, you’re taking an important step in owning your development journey. Let’s get started.
            </p>
            <br />
            <button className="start-button" onClick={onStart}>
              Start Assessment
            </button>
        </div>
    </div>
  );
};

export default AssessmentIntro;
