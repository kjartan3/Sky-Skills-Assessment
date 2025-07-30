import React from "react";
import "./OrgSummary.css";


const OrgSummary = ({
  topBehaviours,
  bottomBehaviours,
  skills,
  topContent,
  bottomContent,
  selectedOrgUnit,
  selectedBand
}) => {
  return (
    <div className="org-summary-container">
      <h3>
        📊 Organisational Summary
        {selectedOrgUnit !== "All" && ` — ${selectedOrgUnit}`}
        {selectedBand !== 'All' && ` - ${selectedBand}`}
      </h3>

      <div className="summary-block">
         <div>
          <h4>Values</h4>
          <ol>
            {skills.map((s, i) => (
                <li key={i}>{s.name}</li>
              ))
            }
          </ol>
        </div>
        <div>
          <h4>Top 3 Behaviours</h4>
          <ul>
            {topBehaviours.map((b, i) => (
              <li key={i}>{b.name} </li>
            ))}
          </ul>

          <h4>Bottom 3 Behaviours</h4>
          <ul>
            {bottomBehaviours.map((b, i) => (
              <li key={i}>{b.name} </li>
            ))}
          </ul>
        </div>

       

        <div>
          <h4>Top 3 Skills</h4>
          <ul>
            {topContent.map((c, i) => (
              <li key={i}>{c.name} </li>
            ))}
          </ul>

          <h4>Bottom 3 Skills</h4>
          <ul>
            {bottomContent.map((c, i) => (
              <li key={i}>{c.name} </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrgSummary;
