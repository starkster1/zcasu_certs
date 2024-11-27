import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './PendingApprovals.module.css';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const PendingApprovals = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch existing pending requests from the backend
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/certificate-requests?status=Pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRequests(data.requests);
        } else {
          console.error('Failed to fetch requests:', data.message);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();

    // Listen for real-time updates
    socket.on('certificate-request-notification', (data) => {
      console.log('New certificate request received:', data);
      setRequests((prev) => [...prev, data]); // Add the new request to the list
    });

    return () => {
      socket.off('certificate-request-notification'); // Cleanup on unmount
    };
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch('http://localhost:5000/api/update-request-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ requestId: id, status: action }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== id)); // Remove the handled request
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Pending Approvals</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>Student Number</th>
              <th className={styles.tableHeader}>Certificate Hash</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{request.studentNumber || 'N/A'}</td>
                <td className={styles.tableCell}>{request.ipfsHash}</td>
                <td className={styles.tableCell}>{request.status}</td>
                <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                  <button
                    className={`${styles.button} ${styles.approveButton}`}
                    onClick={() => handleAction(request._id, 'Verified')}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.button} ${styles.rejectButton}`}
                    onClick={() => handleAction(request._id, 'Revoked')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.noRequests}>
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;






/*import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const PendingApprovals = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch existing pending requests from the backend
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/certificate-requests?status=Pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRequests(data.requests);
        } else {
          console.error('Failed to fetch requests:', data.message);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();

    // Listen for real-time updates
    socket.on('certificate-request-notification', (data) => {
      console.log('New certificate request received:', data);
      setRequests((prev) => [...prev, data]); // Add the new request to the list
    });

    return () => {
      socket.off('certificate-request-notification'); // Cleanup on unmount
    };
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch('http://localhost:5000/api/update-request-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ requestId: id, status: action }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== id)); // Remove the handled request
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Hash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-6 py-4 whitespace-nowrap">{request.studentNumber || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.ipfsHash}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="bg-green-500 text-black px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors"
                    onClick={() => handleAction(request._id, 'Verified')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleAction(request._id, 'Revoked')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;*/





/*// src/components/PendingApprovals.js
import React from 'react';

const PendingApprovals = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
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

export default PendingApprovals;*/
