import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import "./ProficiencyKey.css";

const definitions = {
  Beginner:
    "You have a basic awareness of the skill, including a limited understanding of its importance and how it's applied in practice. You may demonstrate this skill some of the time or require guidance and support to perform tasks related to this skill effectively.",
  Intermediate:
    "You have a solid understanding of the skill, recognise its value and can apply it effectively in your own work most of the time. You are also able to guide others in using the skill, demonstrating leadership in its practical application within your team or area of influence.",
  Advanced:
    "You have deep expertise in the skill, with a clear understanding of its strategic importance to the business. You consistently apply it with confidence in your own work and effectively champion its adoption across teams, departments or the broader organisation to drive strategic and measurable impact.",
};

const ProficiencyKey = () => {
  return (
    <div className="proficiency-container">
      <h4 className="proficiency-header">Proficiency Levels</h4>
      {Object.entries(definitions).map(([level, description]) => (
        <div key={level} className="proficiency-row">
          <div className="tooltip-wrapper top">
            <FaInfoCircle size={16} color="#2563eb" className="info-icon" />
            <div className="tooltip-text top">{description}</div>
          </div>
          <p className="proficiency-label">{level}</p>
        </div>
      ))}
    </div>
  );
};

export default ProficiencyKey;
