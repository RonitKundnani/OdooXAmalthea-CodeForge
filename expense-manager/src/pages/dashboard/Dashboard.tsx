import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Download, Loader2, DollarSign, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (user?.role === 'admin') {
        data = await dashboardAPI.getAdminDashboard();
      } else if (user?.role === 'manager') {
        data = await dashboardAPI.getManagerDashboard();
      } else {
        data = await dashboardAPI.getEmployeeDashboard();
      }
      
      setDashboardData(data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#61C0BF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  
  const cards = [
    { title: 'Total Expenses', value: summary.totalExpenses || 0, color: '#61C0BF', icon: <FileText /> },
    { title: 'Pending', value: summary.pendingExpenses || summary.pendingApprovals || 0, color: '#F2C94C', icon: <Clock /> },
    { title: 'Approved', value: summary.approvedExpenses || 0, color: '#61C0BF', icon: <CheckCircle2 /> },
    { title: 'Rejected', value: summary.rejectedExpenses || 0, color: '#FFB6B9', icon: <XCircle /> },
  ];

  // Add additional cards for admin
  if (user?.role === 'admin') {
    cards.push(
      { title: 'Total Amount', value: `${user.currencyCode} ${(summary.totalAmount || 0).toFixed(2)}`, color: '#61C0BF', icon: <DollarSign /> },
      { title: 'Total Users', value: summary.totalUsers || 0, color: '#BBDED6', icon: <Users /> }
    );
  }

  const recentExpenses = dashboardData?.recentExpenses || [];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 mt-1">
          {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'manager' ? 'Manager Dashboard' : 'Employee Dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <div key={c.title} className="rounded-2xl p-4 shadow-sm border" style={{ background: `${c.color}22` }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{c.title}</div>
                <div className="text-2xl font-semibold text-gray-800">{c.value}</div>
              </div>
              <div className="text-gray-700" style={{ color: c.color }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">Recent Expenses</h3>
          <button className="inline-flex items-center px-3 py-2 rounded-lg bg-[#61C0BF] text-white text-sm shadow hover:brightness-110">
            <Download size={16} className="mr-2"/> Export CSV
          </button>
        </div>
        
        {recentExpenses.length === 0 ? (
          <div className="h-64 rounded-xl border-2 border-dashed border-[#BBDED6] flex items-center justify-center text-gray-500">
            No expenses found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Employee</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense: any) => (
                  <tr key={expense.expense_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <td className="py-3 px-4 text-sm text-gray-700">{expense.user_name}</td>
                    )}
                    <td className="py-3 px-4 text-sm text-gray-700">{expense.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {expense.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">
                      {expense.currency_code} {parseFloat(expense.amount_original).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        expense.status === 'approved' ? 'bg-green-100 text-green-700' :
                        expense.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
