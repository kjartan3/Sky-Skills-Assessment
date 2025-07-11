import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { getLevel } from '../helper/getLevel';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAssessments, setUserAssessments] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

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

    const handleUserClick = async (user) => {
        setSelectedUser(user);

        // api stuff ...
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/${user.userId}`);
            console.log(res.data);
            const numberedAssessments = res.data
                .map((assessment, index) => ({
                ...assessment, 
                displayNumber: index + 1,
                
            }))
            setUserAssessments(numberedAssessments);

            } catch (err) {
                console.error('Error fetching asssessments', err);
            }
    }

    const viewAssessmentDetails = async (assessmentId) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/stats/${assessmentId}`)
            console.log('stats', res.data)
            setStats(res.data);
            setSelectedAssessmentId(assessmentId);
        } catch (err) {
            console.error('Error fetching stats', err);
        }
    }

    const downloadAssessmentExcel = () => {
      if (!userAssessments.length) return;
        
      const flattened = [];
      const behaviourMap = {};
      const skillMap = {};

        
      userAssessments.forEach((assessment) => {
        const { id: assessmentId, userId, createdAt, Responses } = assessment;
    
        Responses.forEach((response) => {
          const statement = response.Statement;
          const content = statement?.Content;
          const behaviour = content?.Behaviour;
          const skill = behaviour?.Skill;
        
          flattened.push({
            AssessmentID: assessment.displayNumber,
            UserID: userId,
            Date: new Date(createdAt).toLocaleDateString(),
            Value: skill?.name || 'N/A',
            Behaviour: behaviour?.name || 'N/A',
            Content: content?.title || 'N/A',
            Statement: statement?.text || 'N/A',
            Score: response.score,
          });

          const behaviourKey = `${assessmentId} - ${behaviour?.name}`;
          if (!behaviourMap[behaviourKey]) {
            behaviourMap[behaviourKey] = {
                AssessmentID: assessment.displayNumber,
                UserID: userId,
                Value: skill?.name,
                Behaviour: behaviour?.name,
                scores: []
            }
          }
          behaviourMap[behaviourKey].scores.push(response.score);
          
          const skillKey = `${assessmentId} - ${skill?.name}`;
          if (!skillMap[skillKey]) {
            skillMap[skillKey] = {
                AssessmentID: assessment.displayNumber,
                UserID: userId,
                Value: skill?.name,
                scores: []
            }
          }
          skillMap[skillKey].scores.push(response.score);
        });
      });

      const behaviourSheet = Object.values(behaviourMap).map(b => {
        const avg = b.scores.reduce((a, s) => a + s, 0) / b.scores.length
        return {
            AssessmentID: b.AssessmentID,
            UserID: b.UserID,
            Value: b.Value,
            Behaviour: b.Behaviour,
            AverageScore: avg.toFixed(2),
            Proficiency: getLevel(avg),
        }
      })

      const skillSheet = Object.values(skillMap).map(s => {
        const avg = s.scores.reduce((a, s) => a + s, 0) / s.scores.length
        return {
            AssessmentID: s.AssessmentID,
            UserID: s.UserID,
            Value: s.Value,
            AverageScore: avg.toFixed(2),
            Proficiency: getLevel(avg),
        }
      })

      const workbook = XLSX.utils.book_new();

      const detailedSheet = XLSX.utils.json_to_sheet(flattened);
      XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Assessment Responses');

      const behaviourSummary = XLSX.utils.json_to_sheet(behaviourSheet);
      XLSX.utils.book_append_sheet(workbook, behaviourSummary, 'Behaviour Proficiency');

      const skillSummary = XLSX.utils.json_to_sheet(skillSheet);
      XLSX.utils.book_append_sheet(workbook, skillSummary, 'Value Proficiency');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${selectedUser.firstName}_assessment_responses.xlsx`);
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
            <div className='user-list'>   
                {filteredUsers.map((user) => (
                    <div key={user.userId}>
                        <p>{user.firstName} {user.lastName} - {user.email}</p>
                        <button onClick={() => handleUserClick(user)}>View</button>
                    </div>    
                ))}
            </div>
            {selectedUser && (
                <div className='user-detail'>
                    <h3>{selectedUser.firstName}'s Assessments</h3>
                     <button onClick={downloadAssessmentExcel}>📥 Download Assessments as Excel</button>
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
            <div className='assessment-details'>

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

