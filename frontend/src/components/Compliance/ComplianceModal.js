import React from "react";
import "./ComplianceModal.css";

const ComplianceModal = ({ onAcknowledge }) => {
  return (
    <div className="compliance-overlay">
      <div className="compliance-box">
        <h3>🔒 Data Compliance Notice</h3>
        <p>
          This app collects and processes assessment data to provide personalised insights. 
          By continuing, you acknowledge and consent to this data being used responsibly and securely.
        </p>
        <button className="compliance-btn" onClick={onAcknowledge}>
          I Acknowledge
        </button>
      </div>
    </div>
  );
};

export default ComplianceModal;
