import React from "react";
import "./OrgSummary.css";


const OrgSummary = ({
  topBehaviours,
  bottomBehaviours,
  skills,
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
          <h4>Values</h4>
          <ol>
            {skills.map((s, i) => (
                <li key={i}>{s.skillName}</li>
              ))
            }
          </ol>
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
              <p key={i}>{b.behaviourName}</p>
            ))}
          </ul>
        </div>

       

        <div>
          <h4>Top 3 Skills</h4>
          <ul>
            {topContent.map((c, i) => (
              <p key={i}>{c.title}</p>
            ))}
          </ul>

          <h4>Bottom 3 Skills</h4>
          <ul>
            {bottomContent.map((c, i) => (
              <p key={i}>{c.title}</p>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrgSummary;
