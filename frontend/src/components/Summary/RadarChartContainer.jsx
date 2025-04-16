import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
  } from 'recharts';
  import React from 'react';

  
  const RadarChartContainer = ({assessments, stats, selectedAssessmentId, COLORS}) => {
    const allSkills = Array.from(
      new Set(
        assessments.flatMap((a) =>
          stats[a.id]?.skillAverages?.map((s) => s.skillName) || []
        )
      )
    );

    const chartData = allSkills.map((skillName) => {
      const point = { skillName };
      assessments.forEach((a) => {
        const avg = stats[a.id]?.skillAverages?.find(s => s.skillName === skillName);
        point[a.id] = avg?.averageScore ?? 1;
      });
      return point;
    });

    return (

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skillName" />
            <PolarRadiusAxis domain={[1, 4]} tick={false} />
            {assessments.map((a, index) => {
              const color = COLORS[index % COLORS.length];
              const isSelected = selectedAssessmentId === a.id;
                            
              return (
                <Radar
                  key={a.id}
                  name={`Assessment ${a.id}`}
                  dataKey={a.id}
                  stroke={color}
                  fill={color}
                  fillOpacity={isSelected ? 0.8 : 0.05} // highlight selected, fade others
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  export default RadarChartContainer;