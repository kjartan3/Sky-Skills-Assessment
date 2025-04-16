import StatementItem from "./StatementItem";

const StatementGroup = ({skillName, behaviourName, statements, answers, onAnswerChange}) => {
    return (
        <>
    {skillName && <h2 className="skill-title">{skillName}</h2>}
    {behaviourName && <h2 className="behaviour-title">{behaviourName}</h2>}
    {statements.map((s) => (
        <StatementItem 
        key={s.id}
        statement={s}
        value={answers[s.id]}
        onChange={onAnswerChange}
        />
    ))}
    </>
);
}

export default StatementGroup;