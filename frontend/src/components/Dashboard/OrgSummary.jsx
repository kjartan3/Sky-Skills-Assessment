import React from "react";
import "./OrgSummary.css";


const OrgSummary = ({
  topBehaviours,
  bottomBehaviours,
  topSkills,
  bottomSkills,
  topContent,
  bottomContent,
  selectedOrgUnit
}) => {
  return (
    <div className="org-summary-container">
      <h3>
        📊 Organisational Summary
        {selectedOrgUnit !== "All" && ` — ${selectedOrgUnit}`}
      </h3>

      <div className="summary-block">
         <div>
          <h4>Top 3 Values</h4>
          <ul>
            {topSkills.map((s, i) => (
              <p key={i}>{s.skillName} </p>
            ))}
          </ul>

          <h4>Bottom 3 Values</h4>
          <ul>
            {bottomSkills.map((s, i) => (
              <p key={i}>{s.skillName} </p>
            ))}
          </ul>
        </div>
        <div>
          <h4>Top 3 Behaviours</h4>
          <ul>
            {topBehaviours.map((b, i) => (
              <p key={i}>{b.behaviourName}</p>
            ))}
          </ul>

          <h4>Bottom 3 Behaviours</h4>
          <ul>
            {bottomBehaviours.map((b, i) => (
              <p key={i}>{b.behaviourName} </p>
            ))}
          </ul>
        </div>

       

        <div>
          <h4>Top 3 Skills</h4>
          <ul>
            {topContent.map((c, i) => (
              <p key={i}>{c.title} </p>
            ))}
          </ul>

          <h4>Bottom 3 Skills</h4>
          <ul>
            {bottomContent.map((c, i) => (
              <p key={i}>{c.title} </p>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrgSummary;
