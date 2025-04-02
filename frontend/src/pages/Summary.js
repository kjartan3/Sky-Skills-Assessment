import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const Summary = () => {
  const [behaviourScores, setBehaviourScores] = useState([]);

  useEffect(() => {
    // Retrieve saved statements and answers from sessionStorage
    const savedStatements = JSON.parse(sessionStorage.getItem("statements")) || [];
    const savedAnswers = JSON.parse(sessionStorage.getItem("answers")) || {};

    if (savedStatements.length === 0 || Object.keys(savedAnswers).length === 0) return;

    // Group scores by behavior
    const behaviourMap = {};

    savedStatements.forEach((statement) => {
      const behaviourName = statement.Behaviour.name;
      const score = savedAnswers[statement.id];

      if (score !== undefined) {
        if (!behaviourMap[behaviourName]) {
          behaviourMap[behaviourName] = { total: 0, count: 0 };
        }

        behaviourMap[behaviourName].total += score;
        behaviourMap[behaviourName].count += 1;
      }
    });

    // Convert behaviourMap to an array of { name, averageScore }
    const scoresArray = Object.entries(behaviourMap).map(([name, { total, count }]) => ({
      name,
      averageScore: (total / count).toFixed(2), // Calculate average score
    }));

    setBehaviourScores(scoresArray);
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
    </div>
  );
};

export default Summary;
