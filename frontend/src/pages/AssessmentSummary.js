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

const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14'];

const AssessmentSummary = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedSkillId, setExpandedSkillId] = useState(null);


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

  const allSkills = Array.from(
    new Set(
      assessments.flatMap((a) =>
        stats[a.id]?.skillAverages?.map((s) => s.skillName) || []
      )
    )
  );

  // Create shared data points for all skills
  const chartData = allSkills.map((skillName) => {
    const point = { skillName };
    assessments.forEach((a) => {
      const avg = stats[a.id]?.skillAverages?.find(s => s.skillName === skillName);
      point[a.id] = avg?.averageScore ?? 1;
    });
    return point;
  });

  return (
    <div className="assessment-summary-container">
      <h2 className="summary-title">Assessment Summary</h2>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <div className="chart-with-list">
          <div className="side-list">
            {assessments.map((a, index) => (
              <div
                key={a.id}
                className="assessment-list-item"
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  color: COLORS[index % COLORS.length],
                  fontWeight: hoveredId === a.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                Assessment #{a.id}
                <br />
                <small>{new Date(a.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skillName" />
                <PolarRadiusAxis domain={[1, 4]} tick={false} />
                {assessments.map((a, index) => {
                  const color = COLORS[index % COLORS.length];
                  return (
                    <Radar
                      key={a.id}
                      name={`Assessment ${a.id}`}
                      dataKey={a.id}
                      stroke={color}
                      fill={color}
                      fillOpacity={hoveredId === null || hoveredId === a.id ? 0.8 : 0.2}
                    />
                  );
                })}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Show cards for each individual assessment */}
      {assessments.map((a) => {
      const skillAverages = stats[a.id]?.skillAverages || [];
      const behaviourAverages = stats[a.id]?.behaviourAverages || [];

      return (
        <div key={a.id} className="assessment">
          <h3 className="assessment-title">Assessment #{a.id}</h3>
          <p style={{ marginTop: "-10px", color: "#777", fontSize: "14px" }}>
            Taken on {new Date(a.createdAt).toLocaleDateString()}
          </p>
      
          <div className="skills-breakdown">
            {skillAverages.map((s) => {
              const skillKey = `${a.id}-${s.skillId}`;
              const isExpanded = expandedSkillId === skillKey;
              console.log("This: ", behaviourAverages)
            
              // Filter behaviours based on skillId
              const behavioursForSkill = behaviourAverages.filter(
                (b) => b.skillId === s.skillId
              );
            
              return (
                <div
                  key={s.skillId}
                  className="skill-card"
                  onClick={() =>
                    setExpandedSkillId(isExpanded ? null : skillKey)
                  }
                  style={{ cursor: "pointer" }}
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
                            {getLevel(b.averageScore)} ({b.averageScore.toFixed(2)})
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
      );
    })}

    </div>
  );
};

export default AssessmentSummary;

