import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { UserList } from './components/users/UserList';
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

      {/* App (protected) routes */}
      <Route path="/" element={<MainLayout />}>
        {/* Redirect root to dashboard for now */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="expenses">
          <Route path="submit" element={<SubmitExpense />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="approvals">
          <Route path="queue" element={<ManagerQueue />} />
        </Route>
        <Route path="workflow">
          <Route path="editor" element={<WorkflowEditor />} />
        </Route>
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}

export default App;
