import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { getLevel } from '../helper/getLevel';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import './ManagerDashboard.css';



const ManagerDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userAssessments, setUserAssessments] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedViewerUser, setSelectedViewerUser] = useState(null);



    const usersPerPage = 10

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching users', err);
            }
        }
        fetchUsers();
    }, [])
    
  

    const filteredUsers = users.filter((user) => {
        const term = searchFilter.toLowerCase();

        return (
            user.firstName.toLowerCase().includes(term) || 
            user.lastName.toLowerCase().includes(term) || 
            user.email.toLowerCase().includes(term)
        );
    })

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  const handleUserClick = async (user) => {
  // If already viewing this user, collapse the panel
  if (selectedViewerUser?.userId === user.userId) {
    setSelectedViewerUser(null);
    setUserAssessments([]);
    setSelectedAssessmentId(null);
    setStats({});
    return;
  }

  // Otherwise, open their assessments
  setSelectedViewerUser(user);

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/${user.userId}`);
    const numberedAssessments = res.data.map((assessment, index) => ({
      ...assessment,
      displayNumber: index + 1,
    }));
    setUserAssessments(numberedAssessments);
  } catch (err) {
    console.error('Error fetching assessments', err);
  }
};



 const viewAssessmentDetails = async (assessmentId) => {
  if (selectedAssessmentId === assessmentId) {
    setSelectedAssessmentId(null);
    setStats({});
    return;
  }

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/stats/${assessmentId}`);
    setStats(res.data);
    setSelectedAssessmentId(assessmentId);
  } catch (err) {
    console.error('Error fetching stats', err);
  }
};


   const downloadSelectedUsersExcel = async () => {
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
                UserID: user.id,
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


    
    

  
    
            
   
 


    return (
        <div className='container'>
            <h2 className='dashboard-header'>Manager Dashboard</h2>
            <div>
                <input 
                    type='text' 
                    placeholder='Search by name or email' 
                    value={searchFilter} 
                    onChange={(e) => setSearchFilter(e.target.value)}
                />
            </div>
           <button
  onClick={() => {
    const pageUserIds = currentUsers.map(u => u.userId);
    const allSelected = pageUserIds.every(id => selectedUsers.includes(id));

    if (allSelected) {
      // Uncheck all on page
      setSelectedUsers(prev => prev.filter(id => !pageUserIds.includes(id)));
    } else {
      // Check all on page
      setSelectedUsers(prev => [...new Set([...prev, ...pageUserIds])]);
    }
  }}
>
  {currentUsers.every(id => selectedUsers.includes(id)) ? 'Deselect All on Page' : 'Select All on Page'}
</button>


            <div className='user-list'>   
                {currentUsers.map((user) => (
  <div key={user.userId}>
    <input
        type="checkbox"
        checked={selectedUsers.includes(user.userId)}
        onChange={() => {
            setSelectedUsers(prev =>
            prev.includes(user.userId)
                ? prev.filter(id => id !== user.userId)
                : [...prev, user.userId]
            );
        }}
        />

        <p>{user.firstName} {user.lastName} - {user.email}</p>
        <button onClick={() => handleUserClick(user)}>View</button>
    </div>    
    ))}

        </div>
        {selectedUsers.length > 0 && (
        <button onClick={downloadSelectedUsersExcel}>
            📥 Download Selected Users' Assessments
        </button>
        )}

            <div className='pagination'>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            ← Prev
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next →
        </button>
        </div>

            {selectedViewerUser && (
                <div className='user-detail' >
                    <h3>{selectedUsers.firstName}'s Assessments</h3>
                     <button onClick={downloadSelectedUsersExcel}>📥 Download Assessments as Excel</button>
                    <ul>
                        {userAssessments.map((a) => (
                            <li key={a.id} >
                                Assessment - <small>{new Date(a.createdAt).toLocaleDateString()}</small>
                                <button onClick={() => viewAssessmentDetails(a.id)}>View Assessment</button>
                            </li>
                        ))}
                    </ul>
                </div>    
            )}
            {selectedAssessmentId && stats.behaviourAverages && (
            <div className='assessment-details' >

            <h3>Top 3 Behaviours</h3>
            <ul>
                  {stats.behaviourAverages
                    .slice()
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .slice(0, 3)
                    .map((behaviour) => (
                    
                    <li key={behaviour.behaviourId}>{behaviour.behaviourName}</li>
                    
                  ))}
            </ul>

            <h3>Bottom 3 Behaviours</h3>
            <ul>
                  {stats.behaviourAverages
                    .slice()
                    .sort((a, b) => a.averageScore - b.averageScore)
                    .slice(0, 3)
                    .map((behaviour) => (
            
                    <li key={behaviour.behaviourId}>{behaviour.behaviourName}</li>
                    
                  ))}
            </ul>
            </div>

            )}

        </div>
    )
};

export default ManagerDashboard;

