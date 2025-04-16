import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Navbar from './components/Navbar';
import Skills from './pages/Skills';
import AssessmentSummary from './pages/AssessmentSummary';


function App() {
  return (
    <Router>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/assessmentsummary" element={<AssessmentSummary />} />
        <Route path="/skills" element={<Skills />} />

      </Routes>
    </Router>
  )
}

export default App;