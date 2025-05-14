import React from "react";

const learningResources = {
  Welcoming: {
    Beginner: "https://example.com/welcoming-beginner",
    Intermediate: "https://example.com/welcoming-intermediate",
    Advanced: "https://example.com/welcoming-advanced",
  },
  Creative: {
    Beginner: "https://example.com/creative-beginner",
    Intermediate: "https://example.com/creative-intermediate",
    Advanced: "https://example.com/creative-advanced",
  },
  Simplifying: {
    Beginner: "https://example.com/simplifying-beginner",
    Intermediate: "https://example.com/simplifying-intermediate",
    Advanced: "https://example.com/simplifying-advanced",
  },
  "Doing the right thing": {
    Beginner: "https://example.com/doingtherightthing-beginner",
    Intermediate: "https://example.com/doingtherightthing-intermediate",
    Advanced: "https://example.com/doingtherightthing-advanced",
  },
}

const getLevel = (score) => {
    if (score >= 3.75) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
};

const getLearningLink = (skillName, score) => {
  
  const level = getLevel(score)
  return learningResources[skillName]?.[level] || "#"
}

const SkillsBreakdown = ({ assessmentId, assessment, stats, expandedSkillId, setExpandedSkillId }) => {
    return (
        <div className="assessment">
          <h3 className="assessment-title">Assessment</h3>
          <p style={{ marginTop: "-10px", color: "#777", fontSize: "14px" }}>
            Taken on {new Date(
              assessment.createdAt
            ).toLocaleDateString()}
          </p>

          <div className="skills-breakdown">
            {stats?.skillAverages?.map((s) => {
                console.log("stats", stats)
              const skillKey = `${assessmentId}-${s.skillId}`;
              const isExpanded = expandedSkillId === skillKey;

              const behavioursForSkill =
                stats?.behaviourAverages?.filter(
                  (b) => b.skillId === s.skillId
                ) || [];

              return (
                <div
                  key={s.skillId}
                  className="skill-card"
                  onClick={() => setExpandedSkillId(isExpanded ? null : skillKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="skill-name">
                    {s.skillName}
                    <br />
                    <span className="skill-level">
                      {getLevel(s.averageScore)} ({s.averageScore.toFixed(2)})
                    </span>
                  </h3>
                  <a href={getLearningLink(s.skillName, s.averageScore)}
                  target="blank"
                  className="learning-link"
                  >
                    Recommended Learning
                  </a>

                  {isExpanded && (
                    <div className="behaviour-breakdown">
                      {behavioursForSkill.length > 0 ? (
                        behavioursForSkill.map((b) => (
                          <div key={b.behaviourId} className="behaviour-item">
                            <strong>{b.behaviourName}</strong> —{" "}
                            {getLevel(b.averageScore)} (
                            {b.averageScore.toFixed(2)})
                          </div>
                          
                        ))
                      ) : (
                        <div className="behaviour-item">
                          No behaviours linked to this skill.
                        </div>
                      )}
                    </div>
                    
                  )}
                </div>
              );
            })}
            </div>
        </div>
    ) 
}


export default SkillsBreakdown;