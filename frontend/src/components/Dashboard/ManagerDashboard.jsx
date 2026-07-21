import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'
import './ManagerDashboard.css';
import OrgSummary from './OrgSummary';
import { downloadLatestAssessmentsExcel } from '../helper/exportLatestExcel';
import { downloadAllAssessmentsExcel } from '../helper/exportAllExcel';
import { downloadOrgSummaryExcel } from '../helper/exportOrgSummaryExcel';
import { getLevel } from '../helper/getLevel';

const ManagerDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [summaryData, setSummaryData] = useState([]);

  const [selectedOrgUnit, setSelectedOrgUnit] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [activeOrgUnit, setActiveOrgUnit] = useState([]);
  const [activeBand, setActiveBand] = useState([])

  const [selectedBand, setSelectedBand] = useState([]);
  const [bands, setBands] = useState([]);

  const orgUnitOptions = [
    
    ...orgUnits.map(unit => ({ value: unit, label: unit }))
  ];

  const bandOptions = [
  
   ...bands.slice().sort().map(b => ({ value: b, label: b }))
    
    
];


  const [filteredBandOptions, setFilteredBandOptions] = useState(bandOptions);
  const [filteredOrgUnitOptions, setFilteredOrgUnitOptions] = useState(orgUnitOptions);


  const [top3Behaviours, setTop3Behaviours] = useState([]);
  const [bottom3Behaviours, setBottom3Behaviours] = useState([]);

  const [skillsSummary, setSkillsSummary] = useState([]);

  const [top3Content, setTop3Content] = useState([]);
  const [bottom3Content, setBottom3Content] = useState([]);

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setAllUsers(res.data);

        const uniqueUnits = [...new Set(res.data.map(u => u.orgUnit).filter(Boolean))].sort();
        setOrgUnits(uniqueUnits);
        setFilteredOrgUnitOptions(uniqueUnits.map(unit => ({ value: unit, label: unit })));

        const uniqueBands = [...new Set(res.data.map(u => u.band).filter(Boolean))].sort();
        setBands(uniqueBands);
        setFilteredBandOptions(uniqueBands.map(b => ({ value: b, label: b })));

      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

 
const handleBandChange = (selectedValues) => {
  setActiveBand(selectedValues);
};
const handleOrgUnitChange = (selectedValues) => {
  setActiveOrgUnit(selectedValues);
};

const fetchSummary = async (orgUnitsSelected, bandsSelected) => {
  const params = {};

  if (orgUnitsSelected.length > 0) {
    params.orgUnit = orgUnitsSelected.join(",");
  }

  if (bandsSelected.length > 0) {
    params.band = bandsSelected.join(",");
  }

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/assessments/org-summary`, { params });

  setSummaryData(res.data);


};


  // 📊 Process summary data
  useEffect(() => {
  const {
    behaviourAverages = [],
    skillAverages = [],
    contentAverages = []
  } = summaryData;

  // 🟩 Sort descending for Top 3
    const sortedBehaviours = [...behaviourAverages].sort((a, b) => b.averageScore - a.averageScore);
    setTop3Behaviours(sortedBehaviours.slice(0, 3));

    // 🟥 Sort ascending for Bottom 3 — worst first!
    const bottomBehaviours = [...behaviourAverages].sort((a, b) => a.averageScore - b.averageScore);
    setBottom3Behaviours(bottomBehaviours.slice(0, 3));

    setSkillsSummary([...skillAverages].sort((a, b) => b.averageScore - a.averageScore));

    const sortedContent = [...contentAverages].sort((a, b) => b.averageScore - a.averageScore);
    setTop3Content(sortedContent.slice(0, 3));

    const bottomContent = [...contentAverages].sort((a, b) => a.averageScore - b.averageScore);
    setBottom3Content(bottomContent.slice(0, 3));
  }, [summaryData]);

useEffect(() => {
  fetchSummary([], []);
}, []);

useEffect(() => {
  fetchSummary(activeOrgUnit, activeBand);
}, [activeOrgUnit, activeBand]);

  
useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, selectedOrgUnit, selectedBand]);

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
      <h1 className='dashboard-header'>Reporting Dashboard</h1>

      {/* 📊 Summary Filter */}
      <div className="summary-filter">
        <label htmlFor="summaryOrgUnitSelect"><strong>Summary Insights:</strong> Filter by Org Unit or by Band</label>
        

        <Select
          isMulti
          options={filteredOrgUnitOptions}
          value={filteredOrgUnitOptions.filter(opt => activeOrgUnit.includes(opt.value))}
          onChange={(selectedOptions) => 
            handleOrgUnitChange(selectedOptions.map(opt => opt.value))}
          placeholder="Select Org Unit"
          styles={{
            control: (base) => ({
              ...base,
              padding: '3px',
              marginLeft: '14px',
              marginRight: '14px',
              borderRadius: '3px',
              fontSize: '14px',
              minWidth: '250px',
            
            }),
            singleValue: (base) => ({
              ...base,
              fontSize: '14px',
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: '16px',
              color: 'hsl(0, 0%, 20%)',
            }),
          }}
        />
        <Select
          isMulti
          options={filteredBandOptions}
          value={filteredBandOptions.filter(opt => activeBand.includes(opt.value))}
          onChange={(selectedOptions) =>
            handleBandChange(selectedOptions.map(opt => opt.value))
          }
          placeholder="Select Band"
          styles={{
            control: (base) => ({
              ...base,
              padding: '3px',
              marginLeft: '14px',
              marginRight: '14px',
              borderRadius: '3px',
              fontSize: '14px',
              minWidth: '250px',
            
            }),
            singleValue: (base) => ({
              ...base,
              fontSize: '14px',
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: '16px',
              color: 'hsl(0, 0%, 20%)',
            }),
          }}
        />

      </div>

      

      <OrgSummary
        topBehaviours={top3Behaviours}
        bottomBehaviours={bottom3Behaviours}
        topContent={top3Content}
        bottomContent={bottom3Content}
        skills={skillsSummary}
        selectedOrgUnit={activeOrgUnit.join(', ') || 'All'}
        selectedBand={activeBand.join(', ') || 'All'}
      />

      {summaryData?.behaviourAverages?.length > 0 && (
        <div className="download-actions">
          <button
            onClick={() =>
              downloadOrgSummaryExcel({
                skills: skillsSummary,
                topBehaviours: top3Behaviours,
                bottomBehaviours: bottom3Behaviours,
                topContent: top3Content,
                bottomContent: bottom3Content,
                selectedOrgUnit: activeOrgUnit.join(', ') || 'All',
                selectedBand: activeBand.join(', ') || 'All'
              })
            }
            className="download-button"
          >
            📥 Download Org Summary as Excel
          </button>
        </div>
      )}


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
          const filteredUserIds = filteredUsers.map(u => u.userId);
          const allSelected = filteredUserIds.every(id => selectedUsers.includes(id));
        
          setSelectedUsers(allSelected ? [] : filteredUserIds);
        }}
      >
        {filteredUsers.every(user => selectedUsers.includes(user.userId))
          ? 'Deselect All'
          : 'Select All'}
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

        <p className='user-numbers'>
          {selectedUsers.length} / {filteredUsers.length} Selected
        </p>
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
        <button style={{ marginRight: '50px' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ← Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button style={{ marginLeft: '50px' }} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
      
    </div>
  );
};

export default ManagerDashboard;
