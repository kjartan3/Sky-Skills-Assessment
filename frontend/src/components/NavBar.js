import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev); 
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate('/auth');
    }

    const isLoggedIn = !!sessionStorage.getItem("token");

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
          }
        };
     
        if (dropdownOpen) {
          document.addEventListener('click', handleClickOutside);
        } else {
          document.removeEventListener('click', handleClickOutside);
        }
    
        return () => document.removeEventListener('click', handleClickOutside);
      }, [dropdownOpen]);

    
    
    return (
        <nav className="navbar">
            
            <Link to="/" className="logo"><img src="/icons/sky-learn-logo.jpeg" className="logo-img" alt="Assessment" />
            <h4 className="logo-title">Sky Skills Assessment</h4>
            </Link>
            {isLoggedIn && (
            <div className="dropdown" ref={dropdownRef}>
                <button className="dropdown-btn" onClick={toggleDropdown}>
                    Menu ▼
                </button>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <Link to="/assessment" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Assessment</Link>
                        <Link to="/assessmentsummary" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Summary</Link>
                        <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                        <Link to="/skills" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Skills</Link>
                        <Link to="/auth" className='dropdown-item logout-btn' onClick={handleLogout}>Logout</Link>
                    </div>
                )}
            </div>
            )}
        </nav>
    );
};

export default Navbar;
