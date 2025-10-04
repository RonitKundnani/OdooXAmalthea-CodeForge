import React from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Download } from 'lucide-react';

export default function Dashboard() {
  const cards = [
    { title: 'Total Claims', value: 128, color: '#61C0BF', icon: <FileText /> },
    { title: 'Pending', value: 14, color: '#F2C94C', icon: <Clock /> },
    { title: 'Approved', value: 96, color: '#61C0BF', icon: <CheckCircle2 /> },
    { title: 'Rejected', value: 18, color: '#FFB6B9', icon: <XCircle /> },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <h3 className="font-medium text-gray-800">All Expenses</h3>
          <button className="inline-flex items-center px-3 py-2 rounded-lg bg-[#61C0BF] text-white text-sm shadow hover:brightness-110"><Download size={16} className="mr-2"/> Export CSV</button>
        </div>
        <div className="h-64 rounded-xl border-2 border-dashed border-[#BBDED6] flex items-center justify-center text-gray-500">
          Table & charts placeholder
        </div>
      </div>
    </div>
  );
}
