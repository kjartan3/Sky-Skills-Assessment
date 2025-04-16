import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssessmentList from '../components/AssessmentList';
import SkillsBreakdown from '../components/SkillsBreakdown';
import RadarChartContainer from '../components/RadarChartContainer';
import './AssessmentSummary.css';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14'];

const AssessmentSummary = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);


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

  return (
    <div className="assessment-summary-container">
      <h2 className="summary-title">Assessment Summary</h2>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <div className="chart-with-list">
          <AssessmentList
            assessments={assessments}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            setSelectedAssessmentId={setSelectedAssessmentId}
            COLORS={COLORS}
          />

          <RadarChartContainer 
            assessments={assessments}
            stats={stats}
            selectedAssessmentId={selectedAssessmentId}
            COLORS={COLORS}
          />
        </div>
      )}

      {/* Selected assessment skill + behaviour breakdown */}
      {selectedAssessmentId && (
        <SkillsBreakdown
          assessmentId={selectedAssessmentId}
          assessment={assessments.find((a) => a.id === selectedAssessmentId)}
          stats={stats[selectedAssessmentId]}
          expandedSkillId={expandedSkillId}
          setExpandedSkillId={setExpandedSkillId}
        />
      )}
    </div>
  );
};

export default AssessmentSummary;
