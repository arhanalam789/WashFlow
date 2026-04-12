/**
 * Main App Component
 *
 * Handles routing and authentication state for the application.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from './services/api';

// Pages
import LoginPage from './pages/LoginPage';
import StudentPage from './pages/StudentPage';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
  };

  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case 'student':
        return '/student';
      case 'staff':
        return '/staff';
      case 'admin':
        return '/admin';
      default:
        return '/login';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
              <LoginPage onLogin={setUser} />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/student"
          element={
            user?.role === 'student' ? (
              <StudentPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/staff"
          element={
            user?.role === 'staff' ? (
              <StaffPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? (
              <AdminPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
