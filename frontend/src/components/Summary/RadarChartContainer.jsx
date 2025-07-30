import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';
import { getLevel } from '../helper/getLevel';



const RadarChartContainer = ({ assessments, stats, selectedAssessmentId, COLORS, skillColors }) => {
  const selectedAssessmentStats = selectedAssessmentId ? stats[selectedAssessmentId]?.skillAverages : [];

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
    point._baseline = 4;
    return point;
  });

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius={120}
          data={chartData}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        >
          <PolarGrid />
          
          {/* ✅ Skill labels now show Skill Name + Skill Level next to it */}
          <PolarAngleAxis
            dataKey="skillName"
            tick={(props) => {
              const { payload, x, y, cx = 0, cy = 0 } = props;
              const skillName = payload.value;
              const skillData = selectedAssessmentStats?.find(skill => skill.skillName === skillName);
              const level = skillData ? getLevel(skillData.averageScore) : null;
            
              // Calculate vector from center to label
              const dx = x - cx;
              const dy = y - cy;
            
              // Extend the vector to push label outward
              const newX = cx + dx * 1.34;
              const newY = cy + dy * 1.21;
            
              // Check for the long skill name
              const isLongSkill = skillName === "Doing the right thing";
            
              return (
                <text x={newX} y={newY} textAnchor="middle" fill="#333" fontSize={13}>
                  {isLongSkill ? (
                    <>
                      <tspan x={newX} dy="-5" fontSize="16" fontWeight="bold" fill='#19A0FF'>Doing the</tspan>
                      <tspan x={newX} dy="17" fontSize="16" fontWeight="bold" fill='#19A0FF'>right thing</tspan>
                    </>
                  ) : (
                    <tspan x={newX} dy="0" fontSize="16" fontWeight="bold"  fill={skillColors[skillName] || "#333"}>{skillName}</tspan>
                  )}
                  {level && (
                    <tspan x={newX} dy="22" fontWeight="normal" fontStyle="italic">({level})</tspan>
                  )}
                </text>
              );
            }}
          />


          {/* ✅ Updated domain to [1, 2.5, 4] */}
          <PolarRadiusAxis domain={[1, 2.5, 4]} tick={false} />
          <Radar 
            dataKey='_baseline'
            stroke='transparent'
            fill='transparent'
            isAnimationActive={false}
          />
    
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
                fillOpacity={isSelected ? 1 : 0.2}
                strokeOpacity={isSelected ? 1 : 0.1}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartContainer;
