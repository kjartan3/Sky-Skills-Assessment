import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import "./Summary.css"
 
const Summary = () => {
  const [behaviourScores, setBehaviourScores] = useState([]);
  const [skillsWithBehaviours, setSkillsWithBehaviours] = useState([]);
 
  const getLevel = (score) => {
    if (score >= 3.75) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
  };
 
  useEffect(() => {
    const savedStatements = JSON.parse(sessionStorage.getItem("statements")) || [];
    const savedAnswers = JSON.parse(sessionStorage.getItem("answers")) || {};
 
    if (savedStatements.length === 0 || Object.keys(savedAnswers).length === 0) return;
 
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
 
    // Create both detailed skill info and average scores in one pass
    const skills = Object.entries(skillMap).map(([skillName, behaviours]) => {
      const behaviourScores = Object.entries(behaviours).map(([behaviourName, { total, count }]) => ({
        behaviourName,
        averageScore: (total / count).toFixed(2),
      }));
 
      const total = Object.values(behaviours).reduce((sum, { total }) => sum + total, 0);
      const count = Object.values(behaviours).reduce((sum, { count }) => sum + count, 0);
      const averageScore = (total / count).toFixed(2);
 
      return {
        skillName,
        behaviourScores,
        averageScore,
      };
    });
 
    // Extract for the chart
    const behaviourScoresArray = skills.map((skill) => ({
      name: skill.skillName,
      averageScore: skill.averageScore,
    }));
 
    setSkillsWithBehaviours(skills);
    setBehaviourScores(behaviourScoresArray);
  }, []);

 
  return (
    <div className="summary-container">
      <h1 className="summary-title">Assessment Summary</h1>
 
      <div className="chart-container">
        {behaviourScores.length > 0 ? (
         <ResponsiveContainer width="100%" height={400}>
         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={behaviourScores} >
           <PolarGrid />
           <PolarAngleAxis
               dataKey="name"
               tickFormatter={(name) => {
                 const skill = skillsWithBehaviours.find((s) => s.skillName === name);
                 if (!skill) return name;
                 const level = getLevel(skill.averageScore);
                 return `${name}\n(${level})`;
               }}
           />
           <PolarRadiusAxis domain={[1, 4]} tick={false} tickCount={4}/>
           <Radar
             name="Score"
             dataKey="averageScore"
             stroke="#007bff"
             fill="#007bff"
             fillOpacity={0.6}
           />
         </RadarChart>
       </ResponsiveContainer>
        ) : (
          <p>No data available. Please complete the assessment.</p>
        )}
      </div>
 
      <div className="skills-breakdown">
        {skillsWithBehaviours.length > 0 && 
            skillsWithBehaviours.map((skill) => (
              <div key={skill.skillName} className="skill-card">
                <h3 className="skill-name">
                  {skill.skillName} <br></br>
                  <span className="skill-level">
                    {getLevel(skill.averageScore)}
                  </span>
                </h3>
                <ul className="behaviours-list">
                  {skill.behaviourScores.map((behaviour) => (
                    <li key={behaviour.behaviourName} className="behaviour-item">
                      <strong>{behaviour.behaviourName}: </strong>
                      {getLevel(behaviour.averageScore)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
        }
      </div>
    </div>
  );
};
 
export default Summary;
