import { Link } from 'react-router-dom';
import "./Home.css"
const Home = () => {
  return (
    <div className="home-container">
      <h1>Sky Skills Assessment</h1>
      <Link to="/assessment">Start Assessment</Link> 
    </div>
  );
};

export default Home;
