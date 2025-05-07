import React from 'react';


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
              </div>
            ))}
          </div>
    )
}

export default AssessmentList;