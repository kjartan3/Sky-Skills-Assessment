import React, { useState } from "react";

const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

const SkillsBreakdown = ({
  assessmentId,
  assessment,
  stats,
  expandedSkillId,
  setExpandedSkillId,
}) => {
  const [expandedBehaviourId, setExpandedBehaviourId] = useState(null);

  // Helper to extract unique content items for a given behaviourId from assessment responses.
  const getContentForBehaviour = (behaviourId) => {
    if (!assessment || !assessment.Responses) return [];
    const contentsMap = {};
    assessment.Responses.forEach((response) => {
      const content = response.Statement?.Content;
      if (content && content.Behaviour?.id === behaviourId) {
        contentsMap[content.id] = content;
      }
    });
    return Object.values(contentsMap);
  };

  return (
    <div className="assessment">
      <h3 className="assessment-title">Assessment #{assessmentId}</h3>
      <p style={{ marginTop: "-10px", color: "#777", fontSize: "14px" }}>
        Taken on {new Date(assessment.createdAt).toLocaleDateString()}
      </p>

      <div className="skills-breakdown">
        {stats?.skillAverages?.map((s) => {
          const skillKey = `${assessmentId}-${s.skillId}`;
          const isExpanded = expandedSkillId === skillKey;

          // Filter behaviours for this skill using the aggregated stats.
          const behavioursForSkill =
            stats?.behaviourAverages?.filter((b) => b.skillId === s.skillId) || [];

          const shouldHide = expandedSkillId && expandedSkillId !== skillKey;
      
          return (
            <div
              key={s.skillId}
              className={`skill-card ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedSkillId(isExpanded ? null : skillKey)}
              style={{
                cursor: "pointer",
                display: shouldHide ? "none" : "block", // 👈 hide non-expanded cards
              }}
            >
              <h3 className="skill-name">
                {s.skillName}
                <br />
                <span className="skill-level">
                  {getLevel(s.averageScore)} ({s.averageScore.toFixed(2)})
                </span>
              </h3>

              {isExpanded && (
                <div className="expanded-content">
                  <div className="skill-details">
                    <p>
                      Placeholder text. This is an example paragraph for testing
                      purposes. Placeholder text. This is an example paragraph for
                      testing purposes. Placeholder text. This is an example
                      paragraph for testing purposes. Test
                    </p>
                  </div>

                  <div className="behaviour-breakdown">
                    {behavioursForSkill.length > 0 ? (
                      behavioursForSkill.map((b) => {
                        const isExpanded = expandedBehaviourId === b.behaviourId;
                        const level = getLevel(b.averageScore)
                        return (
                          <div key={b.behaviourId} className="accordion-item">
                            <div
                              className="accordion-header"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedBehaviourId(
                                  isExpanded ? null : b.behaviourId
                                );
                              }}
                            >
                              <span className="behaviour-title-line">
                                <strong className="behaviour-name">
                                  {b.behaviourName}
                                </strong>
                                <span className="behaviour-level">
                                  {"  —  "} {getLevel(b.averageScore)}
                                </span>
                              </span>
                              <span className="accordion-toggle">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                {getContentForBehaviour(b.behaviourId).map((contentItem) => {
                                const learningLink = contentItem.learningLinks && contentItem.learningLinks[level];
                                return (
                                  <div key={contentItem.id} >
                                    <h4>{contentItem.id}</h4>
                                    <p>{contentItem.description}</p>
                                    {learningLink ? (
                                      <div>
                                        
                                        <a href={learningLink} target="_blank" rel="noopener noreferrer">
                                          Recommended Learning
                                        </a>
                                      </div>
                                    ) : (
                                      <div>
                                        No Learning Link available for 
                                      </div>
                                    )}
                                  </div>
                                  )                             
                                })}
                                {getContentForBehaviour(b.behaviourId).length === 0 && (
                                  <div style={{ marginLeft: '20px' }}>No content available for this behaviour.</div>
                              )}
                           </div>
                         )}
                       </div>
                     );
                   })
                 ) : (
                   <div className="behaviour-item">No behaviours linked to this skill.</div>
                 )}
               </div>
             </div>
           )}
         </div>
       );
     })}
   </div>
 </div>
);
};

export default SkillsBreakdown;

