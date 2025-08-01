import React from "react";
import "../../pages/Assessment.css"; // optional CSS file

const AssessmentIntro = ({ onStart }) => {
  return (
    <div className="container-intro">
        <div className="content-wrapper">
            <h1>Welcome to the Sky Skills Self-Assessment</h1>
            <br />
            <p>This self-assessment is designed to help you reflect on your strengths and development areas across a range of skills that are essential for all of us at Sky. These skills, such as curiosity, AI literacy, data fluency and adaptability are grounded in the Sky Skills Framework, to help you drive personal and professional growth.</p>
            <br />
           <p>Each skill includes a short statement to guide your thinking. These statements combine what the skill means with practical behaviours that show how the skill can be demonstrated in action. </p>
            <br />
            <p>As you assess yourself, please keep the following in mind: </p>
            <ul>
              <li><b className="blue-text-small">Be honest and reflective</b><b>:</b> this is a tool for your development, not a test. The more accurately you assess yourself, the more useful your insights will be.</li>
              <li><b className="blue-text-small">Think about real examples</b><b>:</b> consider how often and how confidently you demonstrate each skill in your day-to-day work or life.</li>
              <li><b className="blue-text-small">Use the guidance statements</b><b>:</b> these are there to help you interpret each skill in context and understand what good looks like.</li>
              <li><b className="blue-text-small">Consider your environment</b><b>:</b> some skills may be easier or harder to demonstrate depending on your role, team, or experience. That’s okay—this is about where you are now, not where you think you should be.</li>
            </ul>
            <br />
            <p>   
              By completing this assessment, you’re taking an important step in owning your development journey. Consider sharing the output with your manager and explore how you can continue to never stop learning through building your strengths and developing new skills. 
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
