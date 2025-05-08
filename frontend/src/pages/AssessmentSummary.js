import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssessmentList from '../components/Summary/AssessmentList';
import SkillsBreakdown from '../components/Summary/SkillsBreakdown';
import RadarChartContainer from '../components/Summary/RadarChartContainer';
import './AssessmentSummary.css';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14'];

const AssessmentSummary = ({ user }) => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user || !user.userId) {
        console.error("User information is missing");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/${user.userId}`, {
          withCredentials: true, // Include session cookies
        });
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

        if (res.data.length > 0) {
          setSelectedAssessmentId(res.data[0].id); // Automatically select the first assessment
        }
      } catch (err) {
        console.error('Error fetching assessments or stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  const displayedAssessments = showAll ? assessments : assessments.slice(-3)

  return (
    loading ? (
      <div className='loading-container'>Loading assessment summary...</div>
    ) :
    <div className="assessment-summary-container">
      <h2 className="summary-title">Assessment Summary</h2>
      
      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        

        <div className="chart-with-list">
          <button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Last 3 Assessments" : "Show All Assessments"}
        </button>
          <AssessmentList
            assessments={displayedAssessments}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            setSelectedAssessmentId={setSelectedAssessmentId}
            COLORS={COLORS}
            stats={stats}
          />

          <RadarChartContainer 
            assessments={displayedAssessments}
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
