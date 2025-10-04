import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface ApprovalItem {
  id: string;
  employee: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initial: ApprovalItem[] = [
  { id: 'a1', employee: 'John Doe', category: 'Travel', amount: 220, currency: 'USD', date: '2025-09-22', status: 'pending' },
  { id: 'a2', employee: 'Jane Smith', category: 'Meals', amount: 38.6, currency: 'USD', date: '2025-09-23', status: 'pending' },
];

export default function ManagerQueue() {
  const [items, setItems] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const approve = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
  const reject = (id: string) => {
    if (!rejectNote.trim()) {
      alert('Comment is required to reject');
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
    setRejectNote('');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manager Approval Queue</h2>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <button onClick={()=> setOpenId(openId === item.id ? null : item.id)} className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#FAE3D9]">
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status} size="sm" />
                <div>
                  <div className="font-medium text-gray-800">{item.employee} · {item.category}</div>
                  <div className="text-sm text-gray-500">{item.date} · {item.currency} {item.amount.toFixed(2)}</div>
                </div>
              </div>
              {openId === item.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>} 
            </button>

            {openId === item.id && (
              <div className="px-4 pb-4 pt-2 border-t bg-white">
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-[#FFF4F2]">
                    <div className="text-gray-500">Employee</div>
                    <div className="font-medium">{item.employee}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFF4F2]">
                    <div className="text-gray-500">Category</div>
                    <div className="font-medium">{item.category}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFF4F2]">
                    <div className="text-gray-500">Amount</div>
                    <div className="font-medium">{item.currency} {item.amount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button onClick={()=> approve(item.id)} className="inline-flex items-center px-4 py-2 rounded-lg bg-[#61C0BF] text-white shadow hover:brightness-110"><Check size={16} className="mr-2"/> Approve</button>
                  <button onClick={()=> reject(item.id)} className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FFB6B9] text-white shadow hover:brightness-110"><X size={16} className="mr-2"/> Reject</button>
                  <div className="relative flex-1">
                    <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input value={rejectNote} onChange={(e)=> setRejectNote(e.target.value)} placeholder="Mandatory comment to reject" className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"/>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">Step progression: 1 of 2 · Manager → Finance</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
