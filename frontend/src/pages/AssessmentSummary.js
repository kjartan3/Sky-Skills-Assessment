import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AssessmentList from '../components/Summary/AssessmentList';
import SkillsBreakdown from '../components/Summary/SkillsBreakdown';
import RadarChartContainer from '../components/Summary/RadarChartContainer';
import ProficiencyKey from '../components/Summary/ProficiencyKey';
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
  const navigate = useNavigate();
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
        console.log("stats", statsResponses)
        const statsByAssessmentId = {};
        res.data.forEach((a, i) => {
          statsByAssessmentId[a.id] = statsResponses[i].data;
        });
        setStats(statsByAssessmentId);
        if (res.data.length > 0) {
          setSelectedAssessmentId(prevId => prevId && statsByAssessmentId[prevId] ? prevId : res.data[0].id);
        } else {
          setSelectedAssessmentId(null);
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
        <div className='intermission-content'>
          <br />
          <p>You have not completed an assessment yet.</p>
          <p>Once you have completed one, your progress and insights will appear here.</p>
          <br />
          <button
            className='start-assessment-button'
            onClick={() => navigate("/assessment")}
          >
            Start Assessment
          </button>
        </div>
      ) : (
        <>

          {/* if there are any issues with the styling on summary page - this is where it may come from */}

          <div className="chart-with-list flex flex-row flex-wrap gap-8 px-8 py-4 items-start">
          
            <div className="flex flex-col gap-4 max-w-md w-full">
              <select
                value={selectedTimeFrame}
                onChange={handleTimeFrameChange}
                className="p-2 border rounded"
              >
                <option value="latest">Latest</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 12 Months</option>
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
            </div>

            <div className="chart-section" style={{ flex: '1 1 400px', minWidth: '300px' }}>
              <RadarChartContainer 
                assessments={displayedAssessments}
                stats={stats}
                selectedAssessmentId={selectedAssessmentId}
                COLORS={COLORS}
              />
            </div>

            <div className="w-[280px] flex-shrink-0">
              <ProficiencyKey />
            </div>
          </div>

      
        

          {selectedAssessmentId && (
            <SkillsBreakdown
              assessmentId={selectedAssessmentId}
              assessment={assessments.find((a) => a.id === selectedAssessmentId)}
              stats={stats[selectedAssessmentId]}
              expandedSkillId={expandedSkillId}
              setExpandedSkillId={setExpandedSkillId}
              getContentForBehaviour={getContentForBehaviour}
              assessmentIndex={assessments.findIndex((a) => a.id === selectedAssessmentId)}
            />
          )}
        </>
      )}
    </div>
  )
);
};

export default AssessmentSummary;
