// src/components/PendingApprovals.js
import React from 'react';

const PendingApprovals = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.filter((s) => s.status === 'Pending').map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">Certificate Approval</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="bg-green-500 text-black px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors">Approve</button>
                <button className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition-colors">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PendingApprovals;
