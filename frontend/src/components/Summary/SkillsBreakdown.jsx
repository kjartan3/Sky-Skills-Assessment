import React, { useState } from "react";
import { getLevel } from '../helper/getLevel';


const SkillsBreakdown = ({
  assessmentId,
  assessment,
  stats,
  expandedSkillId,
  setExpandedSkillId,
  getContentForBehaviour,
}) => {
  const [expandedBehaviourId, setExpandedBehaviourId] = useState(null);

// const skillDescriptions = {
//   Welcoming: "We are inclusive, collaborative and respectful, creating a sense of belonging and opportunity for everyone.",
//   Creative: "We are ambitious and innovative, challenging the status quo to raise the bar on quality for customers.",
//   Simplifying: "We bring clarity, cut through complexity and remove obstacles.",
//   "Doing the right thing": "We are fair and act with integrity, each one of us taking responsibility.",
// };

  return (
    <div className="assessment">
      <h3 className="assessment-title">Assessment</h3>
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

          const skillDesc = assessment.Responses?.find(
            (r) => r.Statement?.Content?.Behaviour?.Skill?.name === s.skillName
            )?.Statement?.Content?.Behaviour?.Skill?.description;
          
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
            <h3 className="skill-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{s.skillName}</span>
              <span className="skill-level">{getLevel(s.averageScore)}</span> {/* ✅ Stays below the title */}
            </div>

            <span style={{ fontSize: "14px" }}>{isExpanded ? "▲" : "▼"}</span> {/* ✅ Moves the arrow to the right */}
          </h3>


              {isExpanded && (
                <div className="expanded-content">
                  <div className="skill-details">
                    
                    <p>{skillDesc || "No description available."}</p>
                  </div>

                  <div className="behaviour-breakdown">
                    {behavioursForSkill.length > 0 ? (
                      behavioursForSkill.map((b) => {
                        const isExpanded = expandedBehaviourId === b.behaviourId;
                        const behaviourLevel = getLevel(b.averageScore)
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
                                  {" — "}&nbsp;&nbsp;&nbsp;{behaviourLevel}
                                </span>
                              </span>
                              <span className="accordion-toggle" style={{ fontSize: "14px" }}>
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                {getContentForBehaviour(b.behaviourId).map((contentItem) => {
                                  const relatedResponse = assessment.Responses?.find((response) => response.Statement?.Content?.id === contentItem.id)
                                  const contentScore = relatedResponse?.score;
                                  const contentLevel = getLevel(contentScore)
                                const learningLink = contentItem.learningLinks && contentItem.learningLinks[contentLevel];
                                return (
                                  <div key={contentItem.id} >
                                   <div className="behaviour-title-line" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <h4 style={{ fontSize: '18px', margin: 0 }}>{contentItem.title}</h4>
                                      <span className="content-level" >
                                        {" — "}&nbsp;&nbsp;{getLevel(contentScore)}
                                      </span>
                                    </div>
                                    <p>{contentItem.description}</p>
                                    
                                    
                                    {learningLink ? (
                                      <div>
                                        
                                        <a href={learningLink} target="_blank" rel="noopener noreferrer">
                                          Recommended Learning
                                        </a>
                                        <br/>
                                        <br/>
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

