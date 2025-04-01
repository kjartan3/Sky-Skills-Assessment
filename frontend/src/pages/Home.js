import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div> 
            <h1>Sky Skills Assessment</h1>
            <Link to="/assessment">Assessment</Link> 
        </div>
    )
}

export default Home;