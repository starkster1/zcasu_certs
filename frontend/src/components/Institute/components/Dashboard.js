// src/components/Dashboard.js
import React from 'react';
import DashboardCard from './DashboardCard';
import { FiAward } from 'react-icons/fi';
import { FaUserGraduate, FaUserShield, FaUserClock, FaExchangeAlt } from 'react-icons/fa';

const Dashboard = () => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Accreditation" value="10" icon={<FiAward />} />
      <DashboardCard title="Linked Accounts" value="150" icon={<FaUserGraduate />} />
      <DashboardCard title="Access Rights" value="120" icon={<FaUserShield />} />
      <DashboardCard title="Pending Approvals" value="15" icon={<FaUserClock />} />
      <DashboardCard title="Change Requests" value="5" icon={<FaExchangeAlt />} />
    </div>
  </div>
);

export default Dashboard;
