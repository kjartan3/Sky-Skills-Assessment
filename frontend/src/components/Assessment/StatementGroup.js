import StatementItem from "./StatementItem";

const StatementGroup = ({ skillName, behaviourName, statements, answers, onAnswerChange, skillColor }) => {
  return (
    <>
      {skillName && <h2 className="skill-title" style={{ color: skillColor }}>{skillName}</h2>}

      <div className="statement-group-container">
        <p className="statement-group-text">
          Need a bit more context?<br /> Just hover over the <strong>'i'</strong> icon next to each statement for helpful tips to guide your answers.
        </p>

        <div style={{ flex: 1 }}>
          {statements.map((statement) => (
            <StatementItem
              key={statement.id}
              statement={statement}
              value={answers[statement.id] || null}
              onChange={onAnswerChange}
              skillColor={skillColor}
            />
          ))}
        </div>
      </div>
    </>
  );
};


export default StatementGroup;