import React, { useState, useEffect } from 'react';
import { Download, Filter, Eye, Edit, Calendar, Search, Loader2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { expensesAPI } from '../../services/api';

export default function History() {
  const [query, setQuery] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await expensesAPI.getExpenses();
      setExpenses(response.expenses || []);
    } catch (err: any) {
      console.error('Fetch expenses error:', err);
      setError(err.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      expense.category?.toLowerCase().includes(query.toLowerCase()) ||
      expense.description?.toLowerCase().includes(query.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      expense.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#61C0BF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Expense History</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-full border text-sm bg-white hover:bg-[#FAE3D9] inline-flex items-center">
            <Filter size={16} className="mr-2"/> Filters
          </button>
          <button className="px-3 py-2 rounded-full border text-sm bg-white hover:bg-[#FAE3D9] inline-flex items-center">
            <Download size={16} className="mr-2"/> CSV
          </button>
        </div>
      </div>

      <div className="mb-3 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
          />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {['All','Pending','Approved','Rejected'].map((chip)=> (
            <button 
              key={chip} 
              onClick={() => setStatusFilter(chip)}
              className={`px-3 py-1 rounded-full border text-xs ${
                statusFilter === chip 
                  ? 'bg-[#61C0BF] text-white border-[#61C0BF]' 
                  : 'bg-white hover:bg-[#FAE3D9]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[#FAE3D9] text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {expenses.length === 0 ? 'No expenses found. Submit your first expense!' : 'No expenses match your search.'}
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense, idx)=> (
                <tr key={expense.expense_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF4F2]'}>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2"/>
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">{expense.category}</td>
                  <td className="px-4 py-3 font-medium">
                    {expense.currency_code} {parseFloat(expense.amount_original).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={expense.status} size="sm"/>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button 
                        className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center"
                        title="View details"
                      >
                        <Eye size={15}/>
                      </button>
                      {expense.status === 'pending' && (
                        <button 
                          className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center"
                          title="Edit expense"
                        >
                          <Edit size={15}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
