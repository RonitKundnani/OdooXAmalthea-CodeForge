import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { UserList } from './components/users/UserList';
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* App (protected) routes */}
      <Route path="/" element={<MainLayout />}>
        {/* Redirect root to login for now (no auth yet) */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="users" element={<UserList />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}

export default App;
