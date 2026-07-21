import React from "react";
import "../../pages/Assessment.css"; // optional CSS file

const AssessmentIntro = ({ onStart }) => {
  return (
    <div className="container-intro">
        <div className="content-wrapper">
            <h1>Welcome to your Sky Skills Self-Reflection</h1>
            <br />
            <p>
              This self-reflection tool is designed to help you reflect on your strengths and development areas across a range of skills that are essential for all of us at Sky.
              These skills, such as curiosity, AI literacy, data fluency and adaptability are grounded in the Sky Skills Framework, to help you drive personal and professional growth.
            </p>
            <p>    
              <b>Sky Skills are Essential Skills.</b> They are highly transferable, required for success across all job roles, and crucial for navigating a rapidly changing workplace. Robust data from the Skills Builder Partnership highlights that essential skills are the ultimate career enablers:
            </p>
            <p>
              <ul>
                <li><b className="blue-text-small">Accelerated Tech Adoption</b><b>:</b> Employees with higher levels of essential skills see a 30% relative increase in their ability to effectively adopt and deploy AI tools at work.</li>
                <li><b className="blue-text-small">Future-Proofing Career Growth</b><b>:</b> 87% of workers agree that essential skills are what will help them adapt to new and emerging technologies.</li>
                <li><b className="blue-text-small">Proven Career Value</b><b>:</b> 92% of UK workers believe essential skills are vital for career success - ranking them as more critical than almost any other skill set.</li>
                <li><b className="blue-text-small">Measurable Financial Return</b><b>:</b> Moving from a lower to a higher essential skills bracket is associated with an average annual wage premium of £3,600 to £4,600.</li>
              </ul>
            </p>
            <br />
           <p>Each skill includes a short statement to guide your thinking. These statements combine what the skill means with practical behaviours that show how the skill can be demonstrated in action. </p>
            <br />
            <p>As you reflect, please keep the following in mind: </p>
            <ul>
              <li><b className="blue-text-small">Be honest and reflective</b><b>:</b> this is a tool for your development, not a test. The more accurately you assess yourself, the more useful your insights will be.</li>
              <li><b className="blue-text-small">Think about real examples</b><b>:</b> consider how often and how confidently you demonstrate each skill in your day-to-day work or life.</li>
              <li><b className="blue-text-small">Use the guidance statements</b><b>:</b> these are there to help you interpret each skill in context and understand what good looks like.</li>
              <li><b className="blue-text-small">Consider your environment</b><b>:</b> some skills may be easier or harder to demonstrate depending on your role, team, or experience. That’s okay—this is about where you are now, not where you think you should be.</li>
              <li><b className="blue-text-small">Consider your confidence to demonstrate each skill</b><b>:</b> While your understanding of each skill is an important foundation, we are asking you to reflect on your confidence to apply each skill while in the context of work. How often do you use this skill in a typical week?</li>
            </ul>
            <br />
            <p>   
              By completing this self-reflection, you’re taking an important step in owning your development journey. Consider sharing the output with your manager and explore how you can continue to never stop learning through building your strengths and developing new skills. 
            </p>
            <br />
            <button className="start-button" onClick={onStart}>
              Start Self-Reflection
            </button>
        </div>
    </div>
  );
};

export default AssessmentIntro;
