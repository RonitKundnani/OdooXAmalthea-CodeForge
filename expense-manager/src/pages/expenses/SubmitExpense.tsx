import React, { useState } from 'react';
import { Upload, Camera, Receipt, Calendar, Tag, DollarSign, FileText, ScanLine } from 'lucide-react';

const currencyList = ['USD', 'EUR', 'INR', 'GBP', 'JPY'];
const categories = [
  { key: 'travel', label: 'Travel', icon: <Tag size={16} /> },
  { key: 'meals', label: 'Meals', icon: <Tag size={16} /> },
  { key: 'accommodation', label: 'Accommodation', icon: <Tag size={16} /> },
  { key: 'office_supplies', label: 'Office Supplies', icon: <Tag size={16} /> },
  { key: 'entertainment', label: 'Entertainment', icon: <Tag size={16} /> },
  { key: 'other', label: 'Other', icon: <Tag size={16} /> },
];

export default function SubmitExpense() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('travel');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  return (
    <div className="animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl shadow-sm border border-[#F3D7CF] bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Submit Expense</h2>
          <p className="text-sm text-gray-500 mb-6">Fill the details below and attach your receipt.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                  />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                >
                  {currencyList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hint: Auto-detected based on your country. Conversion shown on review.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0 appearance-none bg-white pl-3 pr-8 py-2"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <Tag className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Receipt)</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-[#FAE3D9] cursor-pointer text-sm">
                  <Upload size={16} className="mr-2" /> Upload
                  <input type="file" className="hidden" onChange={(e)=> setFileName(e.target.files?.[0]?.name || '')} />
                </label>
                <button className="inline-flex items-center px-3 py-2 rounded-lg bg-[#61C0BF] text-white text-sm shadow hover:brightness-110" type="button">
                  <ScanLine size={16} className="mr-2" /> OCR Scan
                </button>
                {fileName && <span className="text-xs text-gray-600 truncate">{fileName}</span>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this expense for?"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Save as Draft</button>
            <button className="px-5 py-2 rounded-lg bg-[#FFB6B9] text-white shadow hover:brightness-110">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
