import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssessmentList from '../components/Summary/AssessmentList';
import SkillsBreakdown from '../components/Summary/SkillsBreakdown';
import RadarChartContainer from '../components/Summary/RadarChartContainer';
import './AssessmentSummary.css';

const COLORS = [
  '#007bff',
  '#28a745',
  '#ffc107',
  '#17a2b8',
  '#dc3545',
  '#6f42c1',
  '#fd7e14',
];

const AssessmentSummary = ({ user }) => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('latest');

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user || !user.userId) {
        console.error("User information is missing");
        setLoading(false);
        return;
      }

      try {
        // Fetch assessments that now include nested responses (Statement → Content → Behaviour → Skill)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/${user.userId}`, {
          withCredentials: true,
        });
        setAssessments(res.data);

        // Fetch aggregated stats for each assessment
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
          setSelectedAssessmentId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching assessments or stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  const filterAssessmentsByTime = () => {
    if (!assessments || assessments.length === 0) {
      console.error("No assessments found");
      return [];
    }
  
    if (selectedTimeFrame === 'latest') {
      return [assessments[0]];
    }
  
    const cutOffDate = new Date();
    cutOffDate.setMonth(cutOffDate.getMonth() - Number(selectedTimeFrame));
  
    return assessments.filter(a => new Date(a.createdAt) >= cutOffDate);
  };
  
  const displayedAssessments = filterAssessmentsByTime();
  
  // const displayedAssessments = showAll ? assessments : assessments.slice(0, 3);
  
  const handleTimeFrameChange = (e) => {
    const value = e.target.value;
    setSelectedTimeFrame(value);
  
    if (value === "latest") {
      setSelectedAssessmentId(assessments[0]?.id);
    }
  };
  
  const getContentForBehaviour = (behaviourId) => {
    const assessmentObj = assessments.find(a => a.id === selectedAssessmentId);
    if (!assessmentObj || !assessmentObj.Responses) return [];
    const contentsMap = {};
    assessmentObj.Responses.forEach((response) => {
      const content = response.Statement?.Content;
      if (content && content.Behaviour?.id === behaviourId) {
        contentsMap[content.id] = content;
      }
    });
    return Object.values(contentsMap);
  };

  return (
    loading ? (
      <div className='loading-container'>Loading assessment summary...</div>
    ) : (
      <div className="assessment-summary-container">
        <h2 className="summary-title">Assessment Summary</h2>

        {assessments.length === 0 ? (
          <p>No assessments found.</p>
        ) : (
          <div className="chart-with-list">
            <select
              value={selectedTimeFrame}
                onChange={handleTimeFrameChange}
              >
                <option value='latest'>Latest</option>
                <option value='3'>Last 3 Months</option>
                <option value='6'>Last 6 Months</option>
                <option value='12'>Last 12 Months</option>

            </select>
            <AssessmentList
              assessments={displayedAssessments}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              setSelectedAssessmentId={setSelectedAssessmentId}
              COLORS={COLORS}
              stats={stats}
              getContentForBehaviour={getContentForBehaviour}
            />

            <RadarChartContainer 
              assessments={displayedAssessments}
              stats={stats}
              selectedAssessmentId={selectedAssessmentId}
              COLORS={COLORS}
            />
          </div>
        )}

        {selectedAssessmentId && (
          <SkillsBreakdown
            assessmentId={selectedAssessmentId}
            assessment={assessments.find((a) => a.id === selectedAssessmentId)}
            stats={stats[selectedAssessmentId]}
            expandedSkillId={expandedSkillId}
            setExpandedSkillId={setExpandedSkillId}
            getContentForBehaviour={getContentForBehaviour}
          
          />
        )}
      </div>
    )
  );
};

export default AssessmentSummary;
