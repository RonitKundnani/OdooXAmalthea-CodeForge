import React from 'react';
import { GitBranch, Settings, Save, X } from 'lucide-react';

export default function WorkflowEditor() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Workflow Rule Editor</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg border bg-white hover:bg-[#FAE3D9] inline-flex items-center">
            <Settings size={16} className="mr-2"/> Settings
          </button>
          <button className="px-3 py-2 rounded-lg bg-[#61C0BF] text-white inline-flex items-center shadow hover:brightness-110">
            <Save size={16} className="mr-2"/> Save
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-xl border p-4 min-h-[420px]">
          <div className="text-gray-500 text-sm mb-2">Drag & drop nodes to define approval steps</div>
          <div className="grid grid-cols-3 gap-4">
            {['Manager','Finance','Director','Admin'].map((role)=> (
              <div key={role} className="rounded-xl p-4 text-center bg-[#BBDED6] text-gray-800 shadow-sm cursor-move select-none">
                <GitBranch className="mx-auto mb-2"/> {role}
              </div>
            ))}
          </div>
          <div className="mt-4 h-56 rounded-xl border-2 border-dashed border-[#BBDED6] flex items-center justify-center text-gray-500">
            Canvas area (drag nodes here)
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium text-gray-800 mb-3">Rule Settings</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Approval Percentage</label>
              <input type="range" defaultValue={100} className="w-full"/>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Allow Delegation</label>
              <select className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Escalation After (hours)</label>
              <input type="number" defaultValue={48} className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"/>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="px-3 py-2 rounded-lg border bg-white">Cancel</button>
              <button className="px-3 py-2 rounded-lg bg-[#FFB6B9] text-white">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
