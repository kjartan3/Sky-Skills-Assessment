import StatementItem from "./StatementItem";

const StatementGroup = ({skillName, behaviourName, statements, answers, onAnswerChange, skillColor}) => {
    return (
        <>
    {skillName && <h2 className="skill-title" style={{ color: skillColor }}>{skillName}</h2>}<br></br>
    {/* {behaviourName && <h2 className="behaviour-title">{behaviourName}</h2>} */}
    {statements.map((statement) => (
      <StatementItem 
        key={statement.id}
        statement={statement} 
        value={answers[statement.id] || null} 
        onChange={onAnswerChange}
        skillColor={skillColor} 
        
      />
    ))}
    </>
);
}

export default StatementGroup;