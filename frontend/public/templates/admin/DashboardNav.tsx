import { useState } from "react";
import {  ChevronDown, User, LogOut } from 'lucide-react';

const DashboardNav = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return <>
          <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'hotels' && 'Hotels Management'}
              {activeTab === 'rooms' && (selectedHotel ? `Rooms - ${selectedHotel.name}` : 'Rooms Management')}
              {activeTab === 'statistics' && 'Statistics'}
            </h2>
            
            {/* Profile Section */}
            <div className="relative">
              <div className="flex items-center cursor-pointer" onClick={toggleProfileDropdown}>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img src="/api/placeholder/100/100" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="ml-2">Admin User</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} className="mr-2" />
                      <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
  
  </>;
};

export default DashboardNav;
