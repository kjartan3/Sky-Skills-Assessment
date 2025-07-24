import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'

import './ManagerDashboard.css';
import OrgSummary from './OrgSummary';
import { downloadLatestAssessmentsExcel } from '../helper/exportLatestExcel';
import { downloadAllAssessmentsExcel } from '../helper/exportAllExcel';
import { getLevel } from '../helper/getLevel';

const ManagerDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [summaryData, setSummaryData] = useState([]);

  const [selectedOrgUnit, setSelectedOrgUnit] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [activeOrgUnit, setActiveOrgUnit] = useState('All');

  

  const [selectedBand, setSelectedBand] = useState([]);
  const [bands, setBands] = useState([]);


  const [top3Behaviours, setTop3Behaviours] = useState([]);
  const [bottom3Behaviours, setBottom3Behaviours] = useState([]);

  const [skillsSummary, setSkillsSummary] = useState([]);

  const [top3Content, setTop3Content] = useState([]);
  const [bottom3Content, setBottom3Content] = useState([]);

  const usersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setAllUsers(res.data);

        const uniqueUnits = [...new Set(res.data.map(u => u.orgUnit).filter(Boolean))];
        setOrgUnits(uniqueUnits.sort());

        const uniqueBands = [...new Set(res.data.map(u => u.band).filter(Boolean))];
        setBands(uniqueBands.sort());

      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/latest-summary`);
        setSummaryData(res.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
      }
    };

    fetchUsers();
    fetchSummary();
  }, []);

 useEffect(() => {
  if (!summaryData.length) return;
  const filteredSummary = activeOrgUnit === "All"
    ? summaryData
    : summaryData.filter(user => user.orgUnit === activeOrgUnit);
  const behaviours = [];
  const skills = [];
  const content = [];
  filteredSummary.forEach(({ behaviourAverages, skillAverages, contentAverages }) => {
    behaviours.push(...behaviourAverages);
    skills.push(...skillAverages);
    content.push(...contentAverages);
  });
  // ✅ Deduplicate & average skills
  const skillMap = new Map();
  skills.forEach(skill => {
    const key = skill.skillName;
    if (!skillMap.has(key)) {
      skillMap.set(key, { ...skill, totalScore: skill.averageScore, count: 1 });
    } else {
      const existing = skillMap.get(key);
      skillMap.set(key, {
        ...existing,
        totalScore: existing.totalScore + skill.averageScore,
        count: existing.count + 1
      });
    }
  });
  const averagedSkills = Array.from(skillMap.values()).map(s => ({
    skillName: s.skillName,
    averageScore: s.totalScore / s.count
  }));
  const sortedSkills = averagedSkills.sort((a, b) => b.averageScore - a.averageScore);
  setSkillsSummary(sortedSkills);
  // ✅ Deduplicate content
  const contentMap = new Map();
  content.forEach(c => {
    if (!contentMap.has(c.title)) {
      contentMap.set(c.title, c);
    } else {
      const existing = contentMap.get(c.title);
      contentMap.set(c.title, {
        ...existing,
        averageScore: Math.max(existing.averageScore, c.averageScore)
      });
    }
  });
  const dedupedContent = Array.from(contentMap.values());
  setTop3Content([...dedupedContent].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3));
  setBottom3Content([...dedupedContent].sort((a, b) => a.averageScore - b.averageScore).slice(0, 3));
  // ✅ Deduplicate behaviours
  const behaviourMap = new Map();
  behaviours.forEach(b => {
    if (!behaviourMap.has(b.behaviourName)) {
      behaviourMap.set(b.behaviourName, b);
    } else {
      const existing = behaviourMap.get(b.behaviourName);
      behaviourMap.set(b.behaviourName, {
        ...existing,
        averageScore: Math.max(existing.averageScore, b.averageScore)
      });
    }
  });
  const dedupedBehaviours = Array.from(behaviourMap.values());
  setTop3Behaviours([...dedupedBehaviours].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3));
  setBottom3Behaviours([...dedupedBehaviours].sort((a, b) => a.averageScore - b.averageScore).slice(0, 3));
}, [activeOrgUnit, summaryData]);

  

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = (
      user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.orgUnit?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const matchesOrg = selectedOrgUnit.length === 0 || selectedOrgUnit.includes(user.orgUnit);
    const matchesBand = selectedBand.length === 0 || selectedBand.includes(user.band);

    
    return matchesSearch && matchesOrg && matchesBand;


    
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className='container'>
      <h2 className='dashboard-header'>Reporting Dashboard</h2>

      {/* 📊 Summary Filter */}
      <div className="summary-filter">
        <label htmlFor="summaryOrgUnitSelect"><strong>Summary Insights:</strong> Filter by Org Unit</label>
        <select
          id="summaryOrgUnitSelect"
          value={activeOrgUnit}
          onChange={(e) => setActiveOrgUnit(e.target.value)}
        >
          <option value="All">All Units</option>
          {orgUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      <OrgSummary
        topBehaviours={top3Behaviours}
        bottomBehaviours={bottom3Behaviours}
        skills={skillsSummary}
        topContent={top3Content}
        bottomContent={bottom3Content}
        selectedOrgUnit={activeOrgUnit}
      />

      <div className="filter-panel">
  <div className="filter-group">
    <label><strong>Filter by Org Unit</strong></label>
    <Select
      isMulti
      options={orgUnits.map(u => ({ label: u, value: u }))}
      value={orgUnits
        .filter(u => selectedOrgUnit.includes(u))
        .map(u => ({ label: u, value: u }))}
      onChange={(selected) => setSelectedOrgUnit(selected.map(opt => opt.value))}
      placeholder="Select Org Units"
    />
  </div>

  <div className="filter-group">
    <label><strong>Filter by Band</strong></label>
    <Select
      isMulti
      options={bands.map(b => ({ label: b, value: b }))}
      value={bands
        .filter(b => selectedBand.includes(b))
        .map(b => ({ label: b, value: b }))}
      onChange={(selected) => setSelectedBand(selected.map(opt => opt.value))}
      placeholder="Select Bands"
    />
  </div>
</div>


      <input 
        type='text' 
        placeholder='Search by name or email or org unit' 
        value={searchFilter} 
        onChange={(e) => setSearchFilter(e.target.value)}
      />

      <button
        onClick={() => {
          const pageUserIds = currentUsers.map(u => u.userId);
          const allSelected = pageUserIds.every(id => selectedUsers.includes(id));
          setSelectedUsers(prev =>
            allSelected
              ? prev.filter(id => !pageUserIds.includes(id))
              : [...new Set([...prev, ...pageUserIds])]
          );
        }}
      >
        {currentUsers.every(id => selectedUsers.includes(id))
          ? 'Deselect All on Page'
          : 'Select All on Page'}
      </button>
    <div className="user-table-container">
     <table className="user-table">
  <thead>
    <tr>
      <th></th>
      <th>Name</th>
      <th>Email</th>
      <th>Org Unit</th>
      
    </tr>
  </thead>
  <tbody>
    {currentUsers.map(user => (
      <tr key={user.userId}>
        <td>
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.userId)}
            onChange={() =>
              setSelectedUsers(prev =>
                prev.includes(user.userId)
                  ? prev.filter(id => id !== user.userId)
                  : [...prev, user.userId]
              )
            }
          />
        </td>
        <td>{user.firstName} {user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.orgUnit}</td>
        
      </tr>
    ))}
  </tbody>
</table>
</div>

      {selectedUsers.length > 0 && (
        <div className="download-actions">
          <button onClick={() => downloadAllAssessmentsExcel(selectedUsers, getLevel)}>
            📥 Download All Historic Assessments
          </button>
          <button onClick={() => downloadLatestAssessmentsExcel(selectedUsers, getLevel)}>
            📥 Download Current Assessment
          </button>
        </div>
      )}

      <div className='pagination'>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ← Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>

      
    </div>
  );
};

export default ManagerDashboard;
