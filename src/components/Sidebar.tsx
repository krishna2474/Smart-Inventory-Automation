// components/DashboardSidebar.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { X, Menu as MenuIcon, Box, Truck, File as FileIcon, Tag, Coins, BarChart } from "lucide-react";
import { useRouter } from 'next/navigation';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  navigate: (path: string) => void;
};

const SidebarItem = React.memo(
  ({ icon, label, path, isCollapsed, navigate }: SidebarItemProps) => (
    <button onClick={() => navigate(path)} className={`block py-2 px-4 rounded-md hover:bg-[#222] w-full text-left ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        {icon}
        {!isCollapsed && <span className="ml-2">{label}</span>}
      </div>
    </button>
  )
);

type DashboardSidebarProps = {
  isSidebarOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isSidebarOpen, isCollapsed, toggleSidebar, toggleCollapse }) => {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      toggleSidebar(); // Close full sidebar on navigation (optional)
      toggleCollapse(); // Collapse the smaller sidebar (optional)
      router.push(path);
    },
    [router, toggleCollapse, toggleSidebar]
  );

  return (
    <aside
      className={`bg-[#111] fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-6 mb-6">
  {!isCollapsed && <h2 className="text-lg font-semibold">Menu</h2>}

  {/* Show X button on small screens when sidebar is open */}
  <button
    onClick={toggleSidebar}
    className="text-gray-400 hover:text-white focus:outline-none md:hidden"
  >
    <X size={20} />
  </button>

  {/* Show collapse/expand toggle on desktop */}
  <button
    onClick={toggleCollapse}
    className="text-gray-400 hover:text-white focus:outline-none hidden md:block"
  >
    {isCollapsed ? <MenuIcon size={20} /> : <X size={20} />}
  </button>
</div>
      <nav className="space-y-2 p-2">
        <SidebarItem icon={<Box size={20} />} label="View Inventory" path="/inventory" isCollapsed={isCollapsed} navigate={navigate} />
        <SidebarItem icon={<Truck size={20} />} label="Suppliers" path="/suppliers" isCollapsed={isCollapsed} navigate={navigate} />
        <SidebarItem icon={<FileIcon size={20} />} label="Invoices" path="/invoices" isCollapsed={isCollapsed} navigate={navigate} />
        <SidebarItem icon={<Tag size={20} />} label="Categories" path="/categories" isCollapsed={isCollapsed} navigate={navigate} />
        <SidebarItem icon={<Coins size={20} />} label="Payments" path="/payments" isCollapsed={isCollapsed} navigate={navigate} />
        <SidebarItem icon={<BarChart size={20} />} label="Reports" path="/reports" isCollapsed={isCollapsed} navigate={navigate} />
      </nav>
    </aside>
  );
};

export default DashboardSidebar;