import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssessmentOverview.css";

const AssessmentOverview = ({ selectedAssessmentId, assessmentIndex, assessment }) => {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/assessment-summary/${selectedAssessmentId}`);
        setSummaryData(res.data);
      } catch (err) {
        console.error("Error fetching assessment summary:", err);
      }
    };

    if (selectedAssessmentId) fetchSummary();
  }, [selectedAssessmentId]);

  if (!summaryData) return null;

  const {
    behaviourAverages = [],
    skillAverages = [],
    contentAverages = []
  } = summaryData;

  const top3Behaviours = [...behaviourAverages].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
  const bottom3Behaviours = [...behaviourAverages].sort((a, b) => a.averageScore - b.averageScore).slice(0, 3);

  const top3Content = [...contentAverages].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
  const bottom3Content = [...contentAverages].sort((a, b) => a.averageScore - b.averageScore).slice(0, 3);

  const sortedSkills = [...skillAverages].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="assessment-overview-container">
      <h3 className="blue-text">Your Personal Insights Summary</h3>
      <h3 className="blue-text" style={{fontSize: "14px", color: "#007bff", fontWeight: 'normal'}}>Assessment {assessmentIndex + 1} taken on {new Date(assessment.createdAt).toLocaleDateString()}</h3>
      <br />
      <div className="snapshot-text">
        <div className="intro-text">
          <p>
            Discover how you're bringing our values to life, with a clear view of how you're showing up - ranked from 1 (your strongest alignment) to 4 (where there's room to grow). You'll also find:
          </p>
        </div>

        <ul className="centered-list">
          <li><b className="blue-text">Top 3 Strengths:</b> the behaviours and skills consistently demonstrated with impact</li>
          <li><b className="blue-text">Top 3 Growth Opportunities:</b> the behaviours and skills that will benefit from targeted learning and development</li>
        </ul>
      </div>


      <br />

      <div className="summary-block">
        <div>
          <h4>Values</h4>
          <ol style={{listStylePosition: "inside", paddingLeft: "1em", marginLeft: "0"}}>
            {sortedSkills.map((s, i) => (
              <li key={i}>{s.skillName}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4>Strengths (Behaviours)</h4>
          <ul>
            {top3Behaviours.map((b, i) => (
              <li key={i}>{b.behaviourName}</li>
            ))}
          </ul>

          <h4>Growth Opportunities (Behaviours) </h4>
          <ul>
            {bottom3Behaviours.map((b, i) => (
              <li key={i}>{b.behaviourName}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Strengths (Skills) </h4>
          <ul>
            {top3Content.map((c, i) => (
              <li key={i}>{c.title}</li>
            ))}
          </ul>

          <h4>Growth Opportunties (Skills)</h4>
          <ul>
            {bottom3Content.map((c, i) => (
              <li key={i}>{c.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentOverview;
