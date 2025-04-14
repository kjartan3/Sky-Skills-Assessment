import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import './AssessmentSummary.css';

const AssessmentSummary = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});

  const getLevel = (score) => {
    if (score >= 3.75) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/assessments/1`);
        setAssessments(res.data);

        const statsPromises = res.data.map((a) =>
          axios.get(`http://localhost:5000/stats/${a.id}`)
        );

        const statsResponses = await Promise.all(statsPromises);

        const statsByAssessmentId = {};
        res.data.forEach((a, i) => {
          statsByAssessmentId[a.id] = statsResponses[i].data;
        });

        setStats(statsByAssessmentId);
      } catch (err) {
        console.error('Error fetching assessments or stats:', err);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="assessment-summary-container">
      <h2 className="summary-title">Assessment Summary</h2>
  
      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        assessments.map((a) => {
          const skillAverages = stats[a.id]?.skillAverages || [];
          const behaviourAverages = stats[a.id]?.behaviourAverages || [];
  
          return (
            <div key={a.id} className="assessment">
              <h3 className="assessment-title">Assessment #{a.id}</h3>
              <p style={{ marginTop: "-10px", color: "#777", fontSize: "14px" }}>
                Taken on {new Date(a.createdAt).toLocaleDateString()}
              </p>
  
              <div className="chart-container">
                {skillAverages.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={skillAverages}
                    >
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="skillName"
                        tickFormatter={(name) => {
                          const score = skillAverages.find(s => s.skillName === name)?.averageScore;
                          return `${name} (${getLevel(score)})`;
                        }}
                      />
                      <PolarRadiusAxis domain={[1, 4]} tick={false} />
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
                  <p>No skill average data available.</p>
                )}
              </div>
  
              <div className="skills-breakdown">
                {skillAverages.map((s) => (
                  <div key={s.skillId} className="skill-card">
                    <h3 className="skill-name">
                      {s.skillName}
                      <br />
                      <span className="skill-level">
                        {getLevel(s.averageScore)}
                      </span>
                    </h3>
                  </div>
                ))}
              </div>
  
              <div className="skills-breakdown">
                {behaviourAverages.map((b) => (
                  <div key={b.behaviourId} className="skill-card">
                    <h3 className="skill-name">
                      {b.behaviourName}
                      <br />
                      <span className="skill-level">
                        {getLevel(b.averageScore)}
                      </span>
                    </h3>
                  </div>
                ))}
              </div>
  
              <details className="skill-card">
                <summary><strong>View All Responses</strong></summary>
                <ul className="behaviours-list">
                  {a.Responses.map((r) => (
                    <li key={r.id} className="behaviour-item">
                      <em>{r.Statement.text}</em> — <strong>Score:</strong> {r.score}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })
      )}
    </div>
  );
  

 
};

export default AssessmentSummary;
