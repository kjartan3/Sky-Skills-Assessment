import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AssessmentList from '../components/Summary/AssessmentList';
import SkillsBreakdown from '../components/Summary/SkillsBreakdown';
import RadarChartContainer from '../components/Summary/RadarChartContainer';
import ProficiencyKey from '../components/Summary/ProficiencyKey';
import './AssessmentSummary.css';
import Select from 'react-select';
import AssessmentOverview from '../components/Summary/AssessmentOverview';
import { skillColors } from '../components/helper/skillColors';

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
  
 
  
  const handleTimeFrameChange = (selectedOption) => {
    const value = selectedOption?.value;
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

  const options = [
    { value: 'latest', label: 'Current Result' },
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 12 Months' }
  ];

  const getLabel = (value) => {
    switch (value) {
      case 'latest': return 'Current Result';
      case '3': return 'Last 3 Months';
      case '6': return 'Last 6 Months';
      case '12': return 'Last 12 Months';
      default: return '';
    }
  };


  return (
  loading ? (
    <div className='loading-container'>Loading assessment summary...</div>
  ) : (
    <div className="assessment-summary-container">
      <h1 className="summary-title">Sky Skills Reflection Summary</h1>

      {assessments.length === 0 ? (
        <div className='intermission-content'>
          <br />
          <p>You have not completed a reflection yet.</p>
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
           
          
           <div className='info-text'>
          <p>Here's how you're showing up against our four core values - <b>Welcoming</b>, <b>Creative</b>, <b>Simplifying</b> and <b>Doing the Right Thing</b>. 
            <br/> <br/>Take a moment to celebrate your strengths and spot the areas where you can grow even further. 
          <br/> <br/>
            <b className='blue-text-small'>Not sure what the proficiency levels mean? </b><br />
            Hover over the <b>'i'</b> icon for a clear breakdown of what it means to be a <b>Beginner</b>, <b>Intermediate</b> or <b>Advanced</b> level.
          <br/> <br/>   
            <b className='blue-text-small'>Curious to dive deeper into your self-reflection? </b><br />
            Click the <b>'Download as PDF'</b> button against the relevant reflection to view and save your results. Inside, you'll find personalised learning pathways on Sky Learn - designed to help you take the next step in your development journey. 
          <br/> <br/>
            <b className='blue-text-small'>Looking to track your progress over time? </b><br />
            Use the filter drop-down below to compare your previous reflections and reflect on how far you've come. 
            </p>
            </div>
            <div className='summary-grid'>
            <div className="chart-left">
              

              <Select
                options={options}
                value={{ value: selectedTimeFrame, label: getLabel(selectedTimeFrame) }}
                onChange={handleTimeFrameChange}
                placeholder="Select Time Frame"
              />


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
            <div className="chart-right">
              <ProficiencyKey />
            </div>

            <div className="chart-center">
              <RadarChartContainer 
                assessments={displayedAssessments}
                stats={stats}
                selectedAssessmentId={selectedAssessmentId}
                COLORS={COLORS}
                skillColors={skillColors}
              />
            </div>

            </div>
          

          <div>
          <AssessmentOverview 
          selectedAssessmentId={selectedAssessmentId}
          assessmentIndex={assessments.findIndex((a) => a.id === selectedAssessmentId)}
          assessment={assessments.find((a) => a.id === selectedAssessmentId)}
          
          />
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
              skillColors={skillColors}
            />
          )}
        </>
      )}
    </div>
  )
);
};

export default AssessmentSummary;
