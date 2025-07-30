import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssessmentOverview.css";

const AssessmentOverview = ({ selectedAssessmentId, assessmentIndex }) => {
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
      <h3>Assessment #{assessmentIndex + 1} Overview</h3>

      <div className="summary-block">
        <div>
          <h4>Values</h4>
          <ol>
            {sortedSkills.map((s, i) => (
              <li key={i}>{s.skillName}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4>Top 3 Behaviours</h4>
          <ul>
            {top3Behaviours.map((b, i) => (
              <li key={i}>{b.behaviourName}</li>
            ))}
          </ul>

          <h4>Bottom 3 Behaviours</h4>
          <ul>
            {bottom3Behaviours.map((b, i) => (
              <li key={i}>{b.behaviourName}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Top 3 Skills</h4>
          <ul>
            {top3Content.map((c, i) => (
              <li key={i}>{c.title}</li>
            ))}
          </ul>

          <h4>Bottom 3 Skills</h4>
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
