import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Summary from './pages/Summary'
import Navbar from './components/NavBar';

function App() {
  return (
    <Router>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/summary" element={<Summary />} />

      </Routes>
    </Router>
  )
}

export default App;