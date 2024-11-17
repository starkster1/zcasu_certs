// src/components/Dashboard/DashboardCard.js
import React from 'react';

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className="rounded-full bg-indigo-100 p-3 mr-4">
      {React.cloneElement(icon, { className: 'text-indigo-600 text-2xl' })}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  </div>
);

export default DashboardCard;
