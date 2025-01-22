import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { Toaster } from '@/components/ui/toaster';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProjectDetails from './pages/ProjectDetails';
import Unauthorized from './pages/UnauthorizedPage';
import NotFound from './pages/NotFoundPage';
import ProtectedRoute from "./route/protectedroute";
import CoursesList from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import Schedule from './pages/Schedule';
import TimetablePage from './pages/Timetable';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CoursesList />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Schedule />
                </ProtectedRoute>
              }
            />

            <Route
              path="/timetable"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TimetablePage />
                </ProtectedRoute>
              }
            />

            {/* Error routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;