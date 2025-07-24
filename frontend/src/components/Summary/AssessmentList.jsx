import { PDFDownloadLink } from "@react-pdf/renderer";
import AssessmentPDF from "./AssessmentPDF";

const AssessmentList = ({ assessments,hoveredId, setHoveredId, setSelectedAssessmentId, COLORS, stats, getContentForBehaviour }) => (
  <div className="side-list">
    
    {assessments.map((assessment, index) => {
      const displayNumber = index + 1;
      
      return (
        
      <div
        key={assessment.id}
        className="assessment-list-item"
        onClick={() => setSelectedAssessmentId(assessment.id)}
        onMouseEnter={() => setHoveredId(assessment.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          color: COLORS[index % COLORS.length],
          fontWeight: hoveredId === assessment.id ? "bold" : "normal",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <strong>Assessment #{displayNumber}</strong>
          <br />
          <small>{new Date(assessment.createdAt).toLocaleDateString()}</small>
        </div>

        {/* PDF Download Button */}
        <PDFDownloadLink
          document={<AssessmentPDF assessmentId={assessment.id} stats={stats[assessment.id]} assessment={assessment} getContentForBehaviour={getContentForBehaviour} />}
          fileName={`assessment_${assessment.id}.pdf`}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            fontSize: "12px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download")}
        </PDFDownloadLink>
      </div>
    )})}
  </div>
);

export default AssessmentList;
