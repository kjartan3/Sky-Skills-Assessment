import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

export const downloadSelectedUsersExcel = async (selectedUsers, getLevel) =>  
    {
  if (selectedUsers.length === 0) {
    console.log('No users selected');
    return;
  }

  console.log('Starting download for users:', selectedUsers);
  
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/assessments/bulk-assessments`, {
      userIds: selectedUsers,
    });

    console.log('API Response:', res.data);

    if (!res.data || res.data.length === 0) {
      console.log('No data received from API');
      return;
    }

    const allResponses = [];
    const behaviourMap = {};
    const skillMap = {};

    res.data.forEach(({ user, assessments }) => {
      console.log(`Processing user: ${user.firstName} ${user.lastName}`);
      console.log(`Assessments count: ${assessments.length}`);

      // Sort assessments oldest to newest and assign displayNumber manually
      assessments
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .forEach((assessment, index) => {
          const displayNumber = index + 1;
          const { createdAt, Responses, stats } = assessment;
          
          console.log(`Processing assessment ${displayNumber} for user ${user.id}`);
          console.log('Assessment data:', { createdAt, responsesCount: Responses?.length, hasStats: !!stats });

          // Process responses
          if (Responses && Responses.length > 0) {
            Responses.forEach((response) => {
              const statement = response.Statement;
              const content = statement?.Content;
              const behaviour = content?.Behaviour;
              const skill = behaviour?.Skill;
              
              allResponses.push({
                User: `${user.firstName} ${user.lastName}`,
                OrgUnit: user.orgUnit || 'N/A', 
                Assessment: `Assessment ${displayNumber}`,
                Date: new Date(createdAt).toLocaleDateString(),
                Value: skill?.name || 'N/A',
                Behaviour: behaviour?.name || 'N/A',
                Skill: content?.title || 'N/A',
                Statement: statement?.text || 'N/A',
                Score: response.score,
              });
            });
          }
          console.log('Stats object:', stats);


          // Process behaviour averages
          if (stats?.behaviourAverages && stats.behaviourAverages.length > 0) {
            stats.behaviourAverages.forEach((b) => {
              const key = `${user.id}-${displayNumber}-${b.behaviourId}`;
              behaviourMap[key] = {
                Assessment: `Assessment ${displayNumber}`,
                User: `${user.firstName} ${user.lastName}`,
                OrgUnit: user.orgUnit || 'N/A', 
                Date: new Date(createdAt).toLocaleDateString(),
                Value: b.skillId ? b.behaviourName : 'N/A',
                Behaviour: b.behaviourName,
                AverageScore: b.averageScore.toFixed(2),
                Proficiency: getLevel(b.averageScore),
              };
            });
          }

          // Process skill averages
          if (stats?.skillAverages && stats.skillAverages.length > 0) {
            stats.skillAverages.forEach((s) => {
              const key = `${user.id}-${displayNumber}-${s.skillId}`;
              skillMap[key] = {
                Assessment: `Assessment ${displayNumber}`,
                User: `${user.firstName} ${user.lastName}`,
                OrgUnit: user.orgUnit || 'N/A', 
                Date: new Date(createdAt).toLocaleDateString(),
                Value: s.skillName,
                Description: s.description || 'N/A',
                AverageScore: s.averageScore.toFixed(2),
                Proficiency: getLevel(s.averageScore),
              };
            });
          }
        });
    });

    console.log('Processed data:', {
      responsesCount: allResponses.length,
      behavioursCount: Object.keys(behaviourMap).length,
      skillsCount: Object.keys(skillMap).length
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add responses sheet
    const responseSheet = XLSX.utils.json_to_sheet(allResponses);
    XLSX.utils.book_append_sheet(workbook, responseSheet, 'Assessment Responses');
    
    // Add behaviour sheet
    const behaviourSheet = XLSX.utils.json_to_sheet(Object.values(behaviourMap));
    XLSX.utils.book_append_sheet(workbook, behaviourSheet, 'Behaviour Proficiency');
    
    // Add skill sheet
    const skillSheet = XLSX.utils.json_to_sheet(Object.values(skillMap));
    XLSX.utils.book_append_sheet(workbook, skillSheet, 'Skill Proficiency');
    
    // Generate and download file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Selected_Assessments_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    console.log('Download completed successfully');
    
  } catch (err) {
    console.error('Error downloading selected assessments:', err);
    console.error('Error details:', err.response?.data);
  }
};

