import React from "react";

const learningResources = {
  "Be inclusive by nature": {
    Beginner: "https://sky.edcast.com/pathways/emotional-intelligence-beginners",
    Intermediate: "https://sky.edcast.com/pathways/copy-of-emotional-intelligence-beginner",
    Advanced: "https://sky.edcast.com/pathways/emotional-intelligence-advanced",
  },
  "Play as one team": {
    Beginner: "https://sky.edcast.com/journey/our-sky-story-our",
    Intermediate: "https://sky.edcast.com/journey/our-sky-story-our",
    Advanced: "https://sky.edcast.com/journey/our-sky-story-our",
  },
  "Never stop learning": {
    Beginner: "https://sky.edcast.com/pathways/growth-mindset-beginners",
    Intermediate: "https://sky.edcast.com/pathways/copy-of-accelerate-your-career-growth-mindset-for-managers",
    Advanced: "https://sky.edcast.com/pathways/growth-mindset-advanced",
  },
  "Be curious": {
    Beginner: "https://sky.edcast.com/pathways/digital-curiosity-beginner",
    Intermediate: "https://sky.edcast.com/pathways/curiosity-intermediate",
    Advanced: "https://sky.edcast.com/pathways/curiosity-advanced",
  },
  "Be ambitious": {
    Beginner: "https://sky.edcast.com/pathways/agile-thinking-beginner",
    Intermediate: "https://sky.edcast.com/pathways/copy-of-agile-thinking-beginner",
    Advanced: "https://sky.edcast.com/pathways/copy-of-agile-thinking-intermediate",
  },
  "Embrace challenge": {
    Beginner: "https://sky.edcast.com/pathways/change-management",
    Intermediate: "https://sky.edcast.com/pathways/change-management-for-managers",
    Advanced: "https://sky.edcast.com/pathways/change-management-for-leaders",
  },
  "Prioritise ruthlessly": {
    Beginner: "https://sky.edcast.com/pathways/prioritisation",
    Intermediate: "https://sky.edcast.com/pathways/copy-of-prioritisation-beginner",
    Advanced: "https://sky.edcast.com/pathways/prioritisation-advanced",
  },
  "Reduce complexity": {
    Beginner: "https://sky.edcast.com/pathways/critical-thinking",
    Intermediate: "https://sky.edcast.com/pathways/critical-thinking-intermediate",
    Advanced: "https://sky.edcast.com/pathways/copy-of-critical-thinking-advanced",
  },
  "Make it better": {
    Beginner: "https://sky.edcast.com/pathways/continuous-improvement-beginner-continuous",
    Intermediate: "https://sky.edcast.com/pathways/continuous-improvement-intermediate-continuous",
    Advanced: "https://sky.edcast.com/pathways/continuous-improvement-advanced-continuous",
  },
  "Own it": {
    Beginner: "https://sky.edcast.com/pathways/accountability-beginner",
    Intermediate: "https://sky.edcast.com/pathways/accountability-intermediate",
    Advanced: "https://sky.edcast.com/pathways/accountability-advanced",
  },
  "Act with integrity": {
    Beginner: "https://sky.edcast.com/pathways/transparency-beginner",
    Intermediate: "https://sky.edcast.com/pathways/transparency-intermediate",
    Advanced: "https://sky.edcast.com/pathways/transparency-advanced",
  },
  "Act with care": {
    Beginner: "https://sky.edcast.com/pathways/right-conversations-beginner",
    Intermediate: "https://sky.edcast.com/pathways/right-conversations-intermediate",
    Advanced: "https://sky.edcast.com/pathways/right-conversations-advanced",
  },
};


const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

const getLearningLink = (skillName, score) => {
  const level = getLevel(score);
  return learningResources[skillName]?.[level] || "#";
};

const SkillsBreakdown = ({
  assessmentId,
  assessment,
  stats,
  expandedSkillId,
  setExpandedSkillId,
  expandedBehaviourId,
  setExpandedBehaviourId,
}) => {
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

          const behavioursForSkill =
            stats?.behaviourAverages?.filter((b) => b.skillId === s.skillId) || [];

          return isExpanded || !expandedSkillId ? (
            <div
              key={s.skillId}
              className={`skill-card ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedSkillId(isExpanded ? null : skillKey)}
              style={{ cursor: "pointer" }}
            >
              <h3 className="skill-name">
                {s.skillName}
                <br />
                <span className="skill-level">
                  {getLevel(s.averageScore)} ({s.averageScore.toFixed(2)})
                </span>
              </h3>

              {/* Uncomment if you want to show recommended learning link
              <a
                href={getLearningLink(s.skillName, s.averageScore)}
                target="_blank"
                rel="noopener noreferrer"
                className="learning-link"
              >
                Recommended Learning
              </a>
              */}

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
                                <span className="behaviour-level"> {"  —  "} {getLevel(b.averageScore)}
                                </span>
                              </span>
                              <span className="accordion-toggle">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                <p>
                                  {b.detailedDescription ||
                                    "Placeholder text. This is an example paragraph for testing purposes."}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="behaviour-item">
                        No behaviours linked to this skill.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default SkillsBreakdown;
