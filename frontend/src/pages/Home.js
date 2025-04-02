import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Sky Skills Assessment</h1>

            <div className="link-boxes">
                <div className="box">
                    <h2>Take Assessment</h2>
                    <img src="/images/assessment.png" alt="Assessment" />
                    <Link to="/assessment" className="btn">Start</Link>
                </div>

                <div className="box">
                    <h2>View Summary</h2>
                    <img src="/images/summary.png" alt="Summary" />
                    <Link to="/summary" className="btn">View</Link>
                </div>

                <div className="box">
                    <h2>Profile</h2>
                    <img src="/images/profile.png" alt="Profile" />
                    <Link to="/profile" className="btn">Open</Link>
                </div>

                <div className="box">
                    <h2>Skills</h2>
                    <img src="/images/skills.png" alt="Skills" />
                    <Link to="/skills" className="btn">Explore</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
