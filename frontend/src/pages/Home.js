import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TitleVideo from '../components/TitleVideo.js';


    const Home = ({ user }) => {
        useEffect(() => {
            if (!user || !user.userId) {
                console.log("No valid user data found, redirecting to SSO...");
                window.location.href = `${process.env.REACT_APP_API_URL}/auth/login?returnTo=${window.location.origin}`;
            }
        }, [user]);

   

    return (
        <div className="home-container">
            <div>
                <TitleVideo />
            </div>
        </div>
    );
};

export default Home;
