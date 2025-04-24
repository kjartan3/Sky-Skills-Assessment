import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Navbar from './components/Navbar';
import Skills from './pages/Skills';
import AssessmentSummary from './pages/AssessmentSummary';
import Auth from "./pages/Auth";
import ProtectedRoute from './components/Auth/ProtectedRoute'; // or adjust path as needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessmentsummary"
          element={
            <ProtectedRoute>
              <AssessmentSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
