import React, {useState, useEffect} from 'react';
import axios from 'axios';

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
            setUserAssessments(res.data);

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

    return (
        <div className='dashboard-container'>
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
                    <div key={user.userId} onClick={() => handleUserClick(user)}>
                        {user.firstName} {user.lastName} - {user.email}
                    </div>    
                ))}
            </div>
            {selectedUser && (
                <div className='user-detail'>
                    <h3>{selectedUser.firstName}'s Assessments</h3>
                    <ul>
                        {userAssessments.map((a) => (
                            <li key={a.id} onClick={() => viewAssessmentDetails(a.id)}>
                                Assessment #{a.id}
                                
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

