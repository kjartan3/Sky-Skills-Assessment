import React from 'react';

const downloadReport = (assessmentId) => {
  const url = `${process.env.REACT_APP_API_URL}/download/${assessmentId}`;
  window.open(url, '_blank');
};

const AssessmentList = ({assessments, hoveredId, setHoveredId, setSelectedAssessmentId, COLORS}) => {
    return (
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
                Assessment
                <br />
                <small>{new Date(a.createdAt).toLocaleDateString()}</small>
                <button onClick={() => downloadReport(a.id)}>Download as PDF</button>
              </div>
              
            ))}
          </div>
    )
}

export default AssessmentList;