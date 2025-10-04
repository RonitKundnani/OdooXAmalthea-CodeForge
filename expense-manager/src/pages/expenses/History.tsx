import React, { useState } from 'react';
import { Download, Filter, Eye, Edit, Calendar, Search } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';

const rows = [
  { id: 'e1', date: '2025-09-10', category: 'Travel', amount: 120.5, currency: 'USD', status: 'approved' as const },
  { id: 'e2', date: '2025-09-14', category: 'Meals', amount: 45.0, currency: 'USD', status: 'pending' as const },
  { id: 'e3', date: '2025-09-20', category: 'Office Supplies', amount: 89.99, currency: 'USD', status: 'rejected' as const },
];

export default function History() {
  const [query, setQuery] = useState('');

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
            <button key={chip} className="px-3 py-1 rounded-full border text-xs bg-white hover:bg-[#FAE3D9]">{chip}</button>
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
            {rows.map((r, idx)=> (
              <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF4F2]'}>
                <td className="px-4 py-3"><div className="inline-flex items-center"><Calendar size={14} className="text-gray-400 mr-2"/>{r.date}</div></td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3 font-medium">{r.currency} {r.amount.toFixed(2)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} size="sm"/></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center"><Eye size={15}/></button>
                    {r.status === 'pending' && (
                      <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center"><Edit size={15}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
