import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { UserList } from './components/users/UserList';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import SubmitExpense from './pages/expenses/SubmitExpense';
import History from './pages/expenses/History';
import ManagerQueue from './pages/approvals/ManagerQueue';
import WorkflowEditor from './pages/workflow/WorkflowEditor';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - All roles */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Users - Admin only */}
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserList />
          </ProtectedRoute>
        } />
        
        {/* Settings - All roles */}
        <Route path="settings" element={<Settings />} />
        
        {/* Expenses - All roles */}
        <Route path="expenses">
          <Route path="submit" element={<SubmitExpense />} />
          <Route path="history" element={<History />} />
        </Route>
        
        {/* Approvals - Manager and Admin only */}
        <Route path="approvals">
          <Route path="queue" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <ManagerQueue />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Workflow - Admin only */}
        <Route path="workflow">
          <Route path="editor" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <WorkflowEditor />
            </ProtectedRoute>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
