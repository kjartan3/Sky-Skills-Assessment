import React from "react";
import "./ComplianceModal.css";

const ComplianceModal = ({ onAcknowledge }) => {
  return (
    <div className="compliance-overlay">
      <div className="compliance-box">
       <h3>🔒 Data Compliance Notice</h3> 
       <p>
  Sky UK Limited is offering this trial to help you self-assess your capability against the Sky Skill areas. We’ll also use the data generated to identify learning opportunities for particular demographics within Sky and work towards our goal of creating a more inclusive workplace.
</p>

<p>
  The analysis doesn’t focus on individual answers. Instead, we combine the results into groups to find trends and patterns. We’ll also link this data with information you’ve previously provided to Sky on Workday — such as race/ethnicity, religion, sexual orientation, gender identity, disability, and social mobility — to help ensure Sky is providing equal opportunities for all.
</p>

<p>
  Participation is voluntary, and we’ll take steps to ensure your responses remain confidential. Your data will only be used if you have consented by completing the assessment and sharing your personal information via Workday. If you change your mind, you can update your details on Workday&nbsp;
  <a href="https://wd3.myworkday.com/sky/d/task/2997$4586.htmld" target="_blank" rel="noopener noreferrer">here</a>
  &nbsp;or contact us at&nbsp;
  <a href="mailto:inclusion@sky.uk">inclusion@sky.uk</a>.
</p>

<p>
  This data will be accessible by the D&I Team, the Learning & Development Team, and People Analytics. It will be retained for one year and will not be transferred outside the UK.
</p>

<p>
  For more information on how Sky uses your personal data and your rights, please read our employee privacy notice&nbsp;
  <a href="https://people.at.sky/skylife?id=kb_article_view&sys_kb_id=8fb8c9cf830b521010017cf16daad33a" target="_blank" rel="noopener noreferrer">here</a>.
</p>


        <button className="compliance-btn" onClick={onAcknowledge}>
          I Acknowledge
        </button>
      </div>
    </div>
  );
};

export default ComplianceModal;
