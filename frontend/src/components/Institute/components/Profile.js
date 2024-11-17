// src/components/Profile.js
import React, { useState } from 'react';
import StudentProfileForm from './StudentProfileForm';
import './Profile.css';

const Profile = ({ students }) => {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div>
      {showForm ? (
        // Render StudentProfileForm with a Back button
        <div>
          <button
            onClick={handleToggleForm}
            className="purple-background-button mb-4"
          >
            Back to Profile Management
          </button>
          <StudentProfileForm />
        </div>
      ) : (
        // Render the Profile Management view
        <div>
          <h2 className="text-3xl font-bold mb-6">Profile Management</h2>
          
          <div className="mb-6">
            <button 
              onClick={handleToggleForm}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200">
              Add Student
            </button>
          </div>

          {/* Student list table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.studentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Program Name</td>
                    <td className="px-6 py-4 whitespace-nowrap">Level</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors">Approve</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;






/*// src/components/ChangeInstitute.js
import React from 'react';

const Profile = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Profile Management</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">ZCAS University</td>
              <td className="px-6 py-4 whitespace-nowrap">Requested Institute Name</td>
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

export default Profile;
*/