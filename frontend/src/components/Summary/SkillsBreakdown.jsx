import React from "react";


const getLevel = (score) => {
    if (score >= 3.75) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
};

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