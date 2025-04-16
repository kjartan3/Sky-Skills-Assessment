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
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  const getLevel = (score) => {
    if (score >= 3.75) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/1`);
        setAssessments(res.data);

        const statsPromises = res.data.map((a) =>
          axios.get(`${process.env.REACT_APP_API_URL}/stats/${a.id}`)
        );

        const statsResponses = await Promise.all(statsPromises);

        const statsByAssessmentId = {};
        res.data.forEach((a, i) => {
          statsByAssessmentId[a.id] = statsResponses[i].data;
        });

        setStats(statsByAssessmentId);

        // Automatically select the first assessment
        if (res.data.length > 0) {
          setSelectedAssessmentId(res.data[0].id);
        }
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
                onClick={() => setSelectedAssessmentId(a.id)}
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
                  const isSelected = selectedAssessmentId === a.id;
                                
                  return (
                    <Radar
                      key={a.id}
                      name={`Assessment ${a.id}`}
                      dataKey={a.id}
                      stroke={color}
                      fill={color}
                      fillOpacity={isSelected ? 0.8 : 0.05} // highlight selected, fade others
                    />
                  );
                })}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Selected assessment skill + behaviour breakdown */}
      {selectedAssessmentId && (
        <div className="assessment">
          <h3 className="assessment-title">Assessment #{selectedAssessmentId}</h3>
          <p style={{ marginTop: "-10px", color: "#777", fontSize: "14px" }}>
            Taken on {new Date(
              assessments.find((a) => a.id === selectedAssessmentId)?.createdAt
            ).toLocaleDateString()}
          </p>

          <div className="skills-breakdown">
            {stats[selectedAssessmentId]?.skillAverages?.map((s) => {
              const skillKey = `${selectedAssessmentId}-${s.skillId}`;
              const isExpanded = expandedSkillId === skillKey;

              const behavioursForSkill =
                stats[selectedAssessmentId]?.behaviourAverages?.filter(
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
      )}
    </div>
  );
};

export default AssessmentSummary;
