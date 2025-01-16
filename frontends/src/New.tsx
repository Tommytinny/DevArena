import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProjectDetails from './pages/ProjectDetails';
import ProtectedRoute from "./route/protectedroute";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route 
                path="/admin"
                element={
                  <ProtectedRoute
                  allowedRoles={['admin']}
                  >
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/"
                element={
                  <ProtectedRoute
                  allowedRoles={['student']}
                  >
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ProtectedRoute
                  allowedRoles={['student']}
                  >
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              {/* Fallback route for unmatched paths 
              <Route path="/404" element={<NotFoundPage />} />*/}
            </Routes>
          </BrowserRouter>
    </AuthProvider>
          
  );
}

export default App;
