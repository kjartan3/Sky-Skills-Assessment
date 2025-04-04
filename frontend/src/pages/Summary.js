import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const Summary = () => {
  const [behaviourScores, setBehaviourScores] = useState([]);
  const [skillsWithBehaviours, setSkillsWithBehaviours] = useState([]);

  useEffect(() => {
    // Retrieve saved statements and answers from sessionStorage
    const savedStatements = JSON.parse(sessionStorage.getItem("statements")) || [];
    const savedAnswers = JSON.parse(sessionStorage.getItem("answers")) || {};

    if (savedStatements.length === 0 || Object.keys(savedAnswers).length === 0) return;

    // Group scores by skill and behavior
    const skillMap = {};

    savedStatements.forEach((statement) => {
      const skillName = statement.Behaviour.Skill.name;
      const behaviourName = statement.Behaviour.name;
      const score = savedAnswers[statement.id];

      if (score !== undefined) {
        if (!skillMap[skillName]) {
          skillMap[skillName] = {};
        }

        if (!skillMap[skillName][behaviourName]) {
          skillMap[skillName][behaviourName] = { total: 0, count: 0 };
        }

        skillMap[skillName][behaviourName].total += score;
        skillMap[skillName][behaviourName].count += 1;
      }
    });

    // Convert skillMap to an array of { name, averageScore, behaviours }
    const skills = Object.entries(skillMap).map(([skillName, behaviours]) => {
      const behaviourScores = Object.entries(behaviours).map(([behaviourName, { total, count }]) => ({
        behaviourName,
        averageScore: (total / count).toFixed(2), // Calculate average score for behavior
      }));

      return {
        skillName,
        behaviourScores,
      };
    });

    setSkillsWithBehaviours(skills);

    // Calculate average score for each skill (we could reuse the same skillMap)
    const behaviourScoresArray = Object.entries(skillMap).map(([name, behaviours]) => {
      const total = Object.values(behaviours).reduce((sum, { total: score }) => sum + score, 0);
      const count = Object.values(behaviours).reduce((sum, { count }) => sum + count, 0);
      return {
        name,
        averageScore: (total / count).toFixed(2), // Calculate average score for skill
      };
    });

    setBehaviourScores(behaviourScoresArray);
  }, []);

  return (
    <div className="summary-container">
      <h1>Assessment Summary</h1>
      <div className="chart-container">
        {behaviourScores.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={behaviourScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[1, 5]} />
              <Radar name="Score" dataKey="averageScore" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available. Please complete the assessment.</p>
        )}
      </div>

      {/* Breakdown of each skill and its behaviours */}
      <div className="skills-breakdown">
        {skillsWithBehaviours.length > 0 && (
          <div>
            {skillsWithBehaviours.map((skill) => (
              <div key={skill.skillName}>
                <h3>{skill.skillName}</h3>
                <ul>
                  {skill.behaviourScores.map((behaviour) => (
                    <li key={behaviour.behaviourName}>
                      <strong>{behaviour.behaviourName}: </strong>
                      {behaviour.averageScore}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
