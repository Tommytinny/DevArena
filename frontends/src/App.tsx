// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
import CoursesList from './components/Course';
import ProjectDetails from './components/Project-details';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
