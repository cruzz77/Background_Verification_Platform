import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import CandidateDetails from './pages/CandidateDetails';
import CandidateCreateEdit from './pages/CandidateCreateEdit';
import VerificationLogs from './pages/VerificationLogs';
import ReportViewer from './pages/ReportViewer';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<CandidateList />} />
          <Route path="candidates/new" element={<CandidateCreateEdit />} />
          <Route path="candidates/:id" element={<CandidateDetails />} />
          <Route path="candidates/:id/edit" element={<CandidateCreateEdit />} />
          <Route path="logs" element={<VerificationLogs />} />
          <Route path="reports/:candidateId" element={<ReportViewer />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
