import StatementItem from "./StatementItem";

const StatementGroup = ({skillName, behaviourName, statements, answers, onAnswerChange, skillColor}) => {
    return (
        <>
    {skillName && <h2 className="skill-title" style={{ color: skillColor }}>{skillName}</h2>}
    {/* {behaviourName && <h2 className="behaviour-title">{behaviourName}</h2>} */}

    <p
      style={{
        fontSize: '0.95rem', // smaller text
        marginTop: '60px',
        marginBottom: '60px',
        marginRight: '700px',
        color: '#555', // optional: softer color
        fontStyle: 'italic',
      }}
    >
      Need a bit more context?
      Just hover over the <strong>'i'</strong> icon next to each statement for helpful tips to guide your answers.
    </p>

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