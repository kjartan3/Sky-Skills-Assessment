const StatementItem = ({ statement, value, onChange, skillColor }) => {
  return (
    <div className="statement-container">
      <br />
      <p className="statement-style">
        <strong></strong> {statement.text}
      </p>
      <div className="radio-container">
        {[1, 2, 3, 4].map((v) => (
          <div key={v}>
            <input
              type="radio"
              id={`statement-${statement.id}-value-${v}`}
              name={`statement-${statement.id}`}
              value={v}
              checked={value === v}
              onChange={() => onChange(statement.id, v)}
            />
            <label 
              htmlFor={`statement-${statement.id}-value-${v}`} 
              style={value === v ? { backgroundColor: skillColor, color: "white" } : {}}
            >
              {v === 1 ? "Not at all" :
               v === 2 ? "Some of the time" :
               v === 3 ? "Most of the time" : "All the time"}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatementItem;