import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev); // Prevents unnecessary re-renders
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Sky Skills</Link>
            
            <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                    Menu ▼
                </button>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <Link to="/assessment" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Assessment</Link>
                        <Link to="/summary" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Summary</Link>
                        <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                        <Link to="/skills" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Skills</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
