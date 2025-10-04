import React from 'react';
import { Save, Shield, Globe, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <button className="inline-flex items-center px-4 py-2 rounded-lg bg-[#61C0BF] text-white shadow hover:brightness-110">
          <Save size={16} className="mr-2"/> Save Changes
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-medium">
            <Globe size={18}/> General
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Company Name</label>
              <input className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0" placeholder="Acme Inc."/>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Default Currency</label>
              <select className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0">
                <option>USD</option>
                <option>INR</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-medium">
            <Bell size={18}/> Notifications
          </div>
          <div className="space-y-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" defaultChecked/>
              Email notifications
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox"/>
              Push notifications
            </label>
          </div>
        </section>

        <section className="bg-white rounded-xl border p-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-medium">
            <Shield size={18}/> Security
          </div>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Password min length</label>
              <input type="number" defaultValue={8} className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"/>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Session timeout (min)</label>
              <input type="number" defaultValue={30} className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"/>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Two-factor auth</label>
              <select className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0">
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
