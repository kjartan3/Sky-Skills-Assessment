import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { getLevel } from '../helper/getLevel';



import './ManagerDashboard.css';
import OrgUnitFilter from './OrgUnitFilter';
import { downloadSelectedUsersExcel } from '../helper/exportExcel';

const ManagerDashboard = () => {
   
    const [allUsers, setAllUsers] = useState([])
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userAssessments, setUserAssessments] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedViewerUser, setSelectedViewerUser] = useState(null);
    const [orgUnits, setOrgUnits] = useState([]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
    



    const usersPerPage = 10

   useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setAllUsers(res.data);
      

      // Extract unique org units
      const uniqueUnits = [...new Set(
        res.data
          .map(u => u.orgUnit)
          .filter(Boolean)
      )];
      setOrgUnits(uniqueUnits.sort());
    } catch (err) {
      console.error('Error fetching all users', err);
    }
  };

  fetchUsers();
}, []);


    
  
   


   const filteredUsers = allUsers.filter(user => {
  const matchesSearch = (
    user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    user.orgUnit?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const matchesOrg = selectedOrgUnit
    ? user.orgUnit === selectedOrgUnit
    : true;

  return matchesSearch && matchesOrg;
});

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


   


    return (
        <div className='container'>
            <h2 className='dashboard-header'>Manager Dashboard</h2>
            
            <OrgUnitFilter 
                selectedOrgUnit={selectedOrgUnit} 
                setSelectedOrgUnit={setSelectedOrgUnit}
                orgUnits={orgUnits}
            />


            <div>
                <input 
                    type='text' 
                    placeholder='Search by name or org unit' 
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
        <button onClick={() => downloadSelectedUsersExcel(selectedUsers, getLevel)}>
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
                    <h3>{selectedViewerUser.firstName}'s Assessments</h3>
                    <button onClick={() => downloadSelectedUsersExcel([selectedViewerUser.userId], getLevel)}>
                        Download Assessments as Excel
                    </button>

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

