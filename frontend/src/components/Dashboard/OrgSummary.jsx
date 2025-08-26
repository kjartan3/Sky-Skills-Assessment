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
      
      <h3 className="blue-text">
      Organisational Summary
        {selectedOrgUnit !== "All" && ` — ${selectedOrgUnit}`}
        {selectedBand !== 'All' && ` - ${selectedBand}`}
      </h3>
      <br />
      <p>This section gives you a snapshot of how various groups are showing up against our core values - ranked from 1 (strongest alignment) to 4 (where there's room to grow). Use the filters to multi-select by organisational unit or band.
      </p>
      <p>
      You'll also find: 
      </p>
      <ul className="centered-list-org">
        <li><b className="blue-text-small">Top Three Strengths:</b> the behaviours and skills consistently demonstrated with impact</li>
        <li><b className="blue-text-small">Top Three Growth Opportunities:</b> the behaviours and skills that will benefit from targeted learning and development</li>
      </ul>
      <br />
      <br />
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
          <h4>Strengths (Behaviours)</h4>
          <ul>
            {topBehaviours.map((b, i) => (
              <li key={i}>{b.name} </li>
            ))}
          </ul>

          <h4>Growth Opportunities (Behaviours) </h4>
          <ul>
            {bottomBehaviours.map((b, i) => (
              <li key={i}>{b.name} </li>
            ))}
          </ul>
        </div>

       

        <div>
          <h4>Strengths (Skills)</h4>
          <ul>
            {topContent.map((c, i) => (
              <li key={i}>{c.name} </li>
            ))}
          </ul>

          <h4>Growth Opportunties (Skills)</h4>
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
