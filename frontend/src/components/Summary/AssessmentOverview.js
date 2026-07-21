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
      <div className="assessment-header">
        <h4 className="blue-text-small">Reflection {assessmentIndex + 1}</h4>
        <p className="assessment-date">
           -&nbsp;&nbsp; Taken on {new Date(assessment.createdAt).toLocaleDateString()}
        </p>
      </div>
      <br />
      <div className="snapshot-text">
        <div className="intro-text">
          <p>
            Here's your personalised summary of your top strengths and opportunities for growth. 
          </p>
          <br />
          <p>
            In this section you'll discover: 
          </p>
          
        </div>

        {/* <p>
          <b className="blue-text-small">How you're showing up against our values:</b> ranked from 1 (your most strongest value) to 4 (where there's room to grow). 
        </p> */}

        <ul className="centered-list">
          <p>
            <b className="blue-text-small">How you're showing up against our values:</b> ranked from 1 (your most strongest value) to 4 (where there's room to grow). 
          </p>
          <li><b className="blue-text-small">Top Three Strengths:</b> the behaviours and skills consistently demonstrated with impact</li>
          <li><b className="blue-text-small">Top Three Growth Opportunities:</b> the behaviours and skills that will benefit from targeted learning and development</li>
        </ul>
      </div>


      <br />

      <div className="summary-block-two-column">
        {/* Left side - Values */}
        <div className="values-section">
          <div className="values-header">Values</div>
          <div className="values-list">
            {sortedSkills.map((s, i) => (
              <div className="value-item" key={i}>
                <span className="value-rank">{i + 1}.</span> {s.skillName}
              </div>
            ))}
          </div>
        </div>
          
        {/* Right side - Table */}
        <div className="summary-table-section">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Strengths</th>
                <th>Growth Opportunities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Behaviours</strong></td>
                <td>
                  <ul>
                    {top3Behaviours.map((b, i) => (
                      <li key={i}>{b.behaviourName}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {bottom3Behaviours.map((b, i) => (
                      <li key={i}>{b.behaviourName}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td><strong>Skills</strong></td>
                <td>
                  <ul>
                    {top3Content.map((c, i) => (
                      <li key={i}>{c.title}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {bottom3Content.map((c, i) => (
                      <li key={i}>{c.title}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentOverview;