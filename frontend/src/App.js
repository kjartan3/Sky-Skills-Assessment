import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Summary from './pages/Summary'
import Navbar from './components/Navbar';
import Skills from './pages/Skills';

function App() {
  return (
    <Router>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/skills" element={<Skills />} />

      </Routes>
    </Router>
  )
}

export default App;