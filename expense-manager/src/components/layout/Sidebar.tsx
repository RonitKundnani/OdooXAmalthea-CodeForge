import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Send, History as HistoryIcon, GitBranch, CheckSquare } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  
  return (
    <NavLink
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-[#BBDED6] text-[#115e59]' 
          : 'text-gray-600 hover:bg-[#FAE3D9] hover:text-gray-900'
      }`}
    >
      <span className={`mr-3 ${isActive ? 'text-teal-500' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-xl font-bold text-gray-800">
              <span className="text-teal-600">Expense</span>Pro
            </h1>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/expenses/submit" icon={<Send size={20} />} label="Submit Expense" />
            <NavItem to="/expenses/history" icon={<HistoryIcon size={20} />} label="Expense History" />
            <NavItem to="/approvals/queue" icon={<CheckSquare size={20} />} label="Approvals" />
            <NavItem to="/users" icon={<Users size={20} />} label="User Management" />
            <NavItem to="/workflow/editor" icon={<GitBranch size={20} />} label="Workflow Editor" />
            <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
            <LogOut size={18} className="mr-3 text-gray-400" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
