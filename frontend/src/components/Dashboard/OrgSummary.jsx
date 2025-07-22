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
              <li key={i}>{s.skillName} ({s.averageScore.toFixed(2)})</li>
            ))}
          </ul>

          <h4>Bottom 3 Values</h4>
          <ul>
            {bottomSkills.map((s, i) => (
              <li key={i}>{s.skillName} ({s.averageScore.toFixed(2)})</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Top 3 Behaviours</h4>
          <ul>
            {topBehaviours.map((b, i) => (
              <li key={i}>{b.behaviourName} ({b.averageScore.toFixed(2)})</li>
            ))}
          </ul>

          <h4>Bottom 3 Behaviours</h4>
          <ul>
            {bottomBehaviours.map((b, i) => (
              <li key={i}>{b.behaviourName} ({b.averageScore.toFixed(2)})</li>
            ))}
          </ul>
        </div>

       

        <div>
          <h4>Top 3 Skills</h4>
          <ul>
            {topContent.map((c, i) => (
              <li key={i}>{c.title} ({c.averageScore.toFixed(2)})</li>
            ))}
          </ul>

          <h4>Bottom 3 Skills</h4>
          <ul>
            {bottomContent.map((c, i) => (
              <li key={i}>{c.title} ({c.averageScore.toFixed(2)})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrgSummary;
