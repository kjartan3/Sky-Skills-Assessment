const OrgUnitFilter = ({selectedOrgUnit, setSelectedOrgUnit, orgUnits}) => {
    return (
        <>
        <label>Filter by Org Unit:</label>
        <select
        value={selectedOrgUnit}
        onChange={(e) => setSelectedOrgUnit(e.target.value)}
        >
        <option value="">-- Select Org Unit --</option>
        {orgUnits.map((unit, idx) => (
            <option key={idx} value={unit}>
            {unit}
        </option>
        ))}
        </select>
        </>
    )
    
}

export default OrgUnitFilter