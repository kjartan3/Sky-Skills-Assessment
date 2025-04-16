import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
  } from 'recharts';
  import React from 'react';

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14']; 

  const RadarChartContainer = ({assessments, stats, selectedAssessmentId}) => {
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
      
    )
  }