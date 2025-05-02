import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user }) => {
    useEffect(() => {
        if (user === null) {
            console.log("User not logged in, redirecting to SSO")
            window.location.href = `${process.env.REACT_APP_API_URL}/auth/login`
        }
    }, [user]);
    

    return (
        <div className="home-container">
            <h1>Sky Skills Assessment</h1>

            {user ? (
                <p>Welcome back, {user.name}!</p>
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
