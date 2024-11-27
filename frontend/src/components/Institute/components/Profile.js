import React, { useState, useEffect } from 'react';
import StudentProfileForm from './StudentProfileForm';
import styles from './Profile.module.css';

const Profile = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const fetchStudentProfiles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/student/fetchAllProfiles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        setError(data.message || 'Failed to fetch student profiles.');
      }
    } catch (err) {
      setError('An error occurred while fetching profiles.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfiles();
  }, []);

  return (
    <div>
      {showForm ? (
        <div>
          <button onClick={handleToggleForm} className={styles.addButton}>
            Back to Profile Management
          </button>
          <StudentProfileForm />
        </div>
      ) : (
        <div>
          <div className={styles.header}>
            <h2 className="text-3xl font-bold">Profile Management</h2>
            {/* Corrected className */}
            <button onClick={handleToggleForm} className={styles.addButton}>
              Add Student
            </button>
          </div>

          {isLoading ? (
            <p>Loading student profiles...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className={styles.container}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Program</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentNumber}</td>
                      <td>{`${student.firstName} ${student.lastName}`}</td>
                      <td>{student.program || 'N/A'}</td>
                      <td>{student.studyLevel || 'N/A'}</td>
                      <td className={styles.actionButtons}>
                        <button className={`${styles.actionButton} ${styles.edit}`}>Edit</button>
                        <button className={`${styles.actionButton} ${styles.delete}`}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;





/*import React, { useState, useEffect } from 'react';
import StudentProfileForm from './StudentProfileForm';
import './Profile.css';

const Profile = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Fetch student profiles from the backend
  const fetchStudentProfiles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/student/fetchAllProfiles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        setError(data.message || 'Failed to fetch student profiles.');
      }
    } catch (err) {
      setError('An error occurred while fetching profiles.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfiles();
  }, []);

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Profile Management</h2>
            <button 
              onClick={handleToggleForm}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200"
            >
              Add Student
            </button>
          </div>

          {isLoading ? (
            <p>Loading student profiles...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700 text-white">
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
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.studentNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.program || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.studyLevel || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors">
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;*/





/*// src/components/Profile.js
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
*/





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