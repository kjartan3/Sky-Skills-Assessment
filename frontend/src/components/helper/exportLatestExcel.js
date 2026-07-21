import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

export const downloadLatestAssessmentsExcel = async (selectedUsers, getLevel) => {
  if (selectedUsers.length === 0) return;

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/assessments/bulk-assessments`, {
      userIds: selectedUsers,
    });

    const allResponses = [];
    const behaviourMap = {};
    const skillMap = {};

    res.data.forEach(({ user, assessments }) => {
      if (!assessments || assessments.length === 0) return;

      // Get the most recent one
      const latest = assessments.reduce((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? a : b
      );

      const { createdAt, Responses, stats } = latest;

      // Process Responses
      Responses?.forEach((response) => {
        const statement = response.Statement;
        const content = statement?.Content;
        const behaviour = content?.Behaviour;
        const skill = behaviour?.Skill;

        allResponses.push({
          User: `${user.firstName} ${user.lastName}`,
          EmailAddress: user.email || 'N/A',
          OrgUnit: user.orgUnit || 'N/A',
          Band: user.band || "N/A", 
          Date: new Date(createdAt).toLocaleDateString(),
          Value: skill?.name || 'N/A',
          Behaviour: behaviour?.name || 'N/A',
          Skill: content?.title || 'N/A',
          Statement: statement?.text || 'N/A',
          Score: response.score,
          Proficiency: getLevel(response.score),
        });
      });

      // Behaviours
      stats?.behaviourAverages?.forEach((b) => {
        const key = `${user.id}-${b.behaviourId}`;
        behaviourMap[key] = {
          User: `${user.firstName} ${user.lastName}`,
          EmailAddress: user.email || 'N/A',
          OrgUnit: user.orgUnit || 'N/A',
          Band: user.band || "N/A", 
          Date: new Date(createdAt).toLocaleDateString(),
          Value: b.skillId ? b.behaviourName : 'N/A',
          Behaviour: b.behaviourName,
          AverageScore: b.averageScore.toFixed(2),
          Proficiency: getLevel(b.averageScore),
        };
      });

      // Skills
      stats?.skillAverages?.forEach((s) => {
        const key = `${user.id}-${s.skillId}`;
        skillMap[key] = {
          User: `${user.firstName} ${user.lastName}`,
          EmailAddress: user.email || 'N/A',
          OrgUnit: user.orgUnit || 'N/A',
          Band: user.band || "N/A", 
          Date: new Date(createdAt).toLocaleDateString(),
          Value: s.skillName,
          Description: s.description || 'N/A',
          AverageScore: s.averageScore.toFixed(2),
          Proficiency: getLevel(s.averageScore),
        };
      });
    });

    const workbook = XLSX.utils.book_new();
    

    const responseSheet = XLSX.utils.json_to_sheet(allResponses);
    XLSX.utils.book_append_sheet(workbook, responseSheet, 'Responses');

    const behaviourSheet = XLSX.utils.json_to_sheet(Object.values(behaviourMap));
    XLSX.utils.book_append_sheet(workbook, behaviourSheet, 'Behaviour Proficiency');

    const skillSheet = XLSX.utils.json_to_sheet(Object.values(skillMap));
    XLSX.utils.book_append_sheet(workbook, skillSheet, 'Value Proficiency');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Latest_Assessments_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (err) {
    console.error('Error exporting latest assessments:', err.message);
  }
};
