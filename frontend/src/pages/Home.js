import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [checked, setChecked] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/debug-session`, {credentials: 'include'})
        .then(res => res.json())
        .then(data => {
            console.log("session check", data)
            if (data.session && data.session.user) {
                setUser(data.session.user)
            } else {
                console.log("User not logged in, redirecting to SSO")
                window.location.href = `${process.env.REACT_APP_API_URL}/auth/login`
            }
        })
        .catch(err => console.error("session fetch erorr:", err))   
        .finally(() => setChecked(true))  
            
        
        
    }, []);

    if (!checked) {
        return <p>Loading...</p>
    }
    

    return (
        <div className="home-container">
            <h1>Sky Skills Assessment</h1>

            {user ? (
                <p>Welcome back, {user.nameId || "User"}!</p>
            ) : (
                <p>Redirecting to SSO</p>
            )}

            <div className="link-boxes">
                <div className="box">
                    <h2>Assessment</h2>
                    <img src="/icons/3d-cube.png" alt="Assessment" />
                    <Link to="/assessment" className="btn">Start</Link>
                </div>

                <div className="box">
                    <h2>Summary</h2>
                    <img src="/icons/analytics.png" alt="Summary" />
                    <Link to="/assessmentsummary" className="btn">View</Link>
                </div>

                <div className="box">
                    <h2>Profile</h2>
                    <img src="/icons/user-2.png" alt="Profile" />
                    <Link to="/profile" className="btn">Open</Link>
                </div>

                <div className="box">
                    <h2>Skills</h2>
                    <img src="/icons/online-learning.png" alt="Skills" />
                    <Link to="/skills" className="btn">Explore</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
