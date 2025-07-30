import React from "react";
import "./ComplianceModal.css";

const ComplianceModal = ({ onAcknowledge }) => {
  return (
    <div className="compliance-overlay">
      <div className="compliance-box">
        <h3>🔒 Data Compliance Notice</h3>

        <p>
          Sky UK Limited is offering this trial to help you self-assess your
          capability against the Sky Skill areas. We’ll also use the data
          generated to identify learning opportunities across different
          demographics within Sky and work towards our goal of creating a more
          inclusive workplace.
        </p>

        <p>
          The analysis doesn’t focus on individual answers. Instead, we’ll
          group results to identify trends and patterns. We’ll combine this
          data with details you've previously shared on Workday — such as
          race/ethnicity, religion, sexual orientation, gender identity,
          disability, social mobility — along with other information (e.g.
          salary band, business unit, nationality, marital status) to ensure
          equal opportunities across Sky.
        </p>

        <p>Participation is voluntary and your responses will be kept confidential.</p>

        <p>
          This data will be accessible by the D&I Team, Learning & Development,
          and People Analytics. It will be retained for one year and not
          transferred outside the UK.
        </p>

        <p>
          We use your data based on our legitimate interest in promoting
          equality and inclusion at Sky. We only use data from Workday where
          you've consented to share it with us. You can update your Workday
          information{" "}
          <a href="https://wd3.myworkday.com/sky/d/task/2997$4586.htmld" target="_blank" rel="noopener noreferrer">
            here
          </a>{" "}
          or contact us at <a href="mailto:inclusion@sky.uk">inclusion@sky.uk</a>{" "}
          to object to this use. The D&I Team, L&D Team, and People Analytics
          may access the data. We'll retain it for up to one year unless needed
          longer for the above purpose. No transfers outside the UK will occur.
        </p>

        <p>
          If you're in the UK or Ireland, please read our employee privacy
          notice to understand how Sky uses your personal data and your rights,
          available{" "}
          <a href="https://people.at.sky/skylife?id=kb_article_view&sys_kb_id=8fb8c9cf830b521010017cf16daad33a" target="_blank" rel="noopener noreferrer">
            here
          </a>.
        </p>

        <button className="compliance-btn" onClick={onAcknowledge}>
          I Acknowledge
        </button>
      </div>
    </div>
  );
};

export default ComplianceModal;
