import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { FaUserGraduate, FaUserShield, FaUserClock } from 'react-icons/fa';
import { FiAward } from 'react-icons/fi';
import socket from '../../../utils/socket';
import { toast } from 'react-toastify';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/certificate-requests?status=Pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch pending requests.');
      const data = await response.json();
      setPendingApprovals(data.requests.length);
      setPendingRequests(data.requests);
    } catch (error) {
      toast.error('Error fetching pending requests.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();

    socket.on('new-certificate-request', async () => {
      console.log('New certificate request received');
      fetchPendingRequests();
    });

    return () => {
      socket.off('new-certificate-request');
    };
  }, []);

  useEffect(() => {
    const reconnectSocket = () => {
      socket.connect();
    };

    socket.on('disconnect', () => {
      console.warn('Socket disconnected. Attempting to reconnect...');
      setTimeout(reconnectSocket, 3000);
    });

    return () => {
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.header}>Welcome Back!</h2>

      <div className={`${styles.cardGrid} ${styles.mdGrid} ${styles.lgGrid}`}>
        <DashboardCard title="Accreditation" value="2" icon={<FiAward />} />
        <DashboardCard title="Linked Accounts" value="0" icon={<FaUserGraduate />} />
        <DashboardCard title="Access Rights" value="0" icon={<FaUserShield />} />
        <DashboardCard title="Pending Approvals" value={pendingApprovals} icon={<FaUserClock />} />
      </div>

      <div className={styles.approvalsSection}>
        <h1 className={styles.sectionHeader}>Pending Certificate Approvals</h1>
        <p className={styles.totalApprovals}>
          Total Pending Approvals: <strong>{pendingApprovals}</strong>
        </p>

        <div className={styles.pendingRequests}>
          {isLoading ? (
            <p className={styles.loadingMessage}>Loading pending requests...</p>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((request, index) => (
              <div key={index} className={styles.requestItem}>
                <p className={styles.requestField}>
                  <strong>Student Number:</strong> {request.studentNumber || 'N/A'}
                </p>
                <p className={styles.requestField}>
                  <strong>Document Hash:</strong> {request.ipfsHash || 'N/A'}
                </p>
                <p className={styles.requestField}>
                  <strong>Date Uploaded:</strong>{' '}
                  {request.timestamp ? new Date(request.timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
            ))
          ) : (
            <p className={styles.errorMessage}>No pending requests at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




// src/components/Dashboard.js
/*import React from 'react';
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

export default Dashboard;*/


/*
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import DashboardCard from './DashboardCard';
import { toast } from 'react-toastify';
import { FiAward } from 'react-icons/fi';
import { FaUserGraduate, FaUserShield, FaUserClock, FaExchangeAlt } from 'react-icons/fa';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const Dashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]); // To hold the pending requests

  useEffect(() => {
    
    // Fetch initial count and requests of pending approvals
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/certificate-requests?status=Pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Replace with your actual token handling
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending requests.');
        }

        const data = await response.json();
        setPendingApprovals(data.requests.length);
        setPendingRequests(data.requests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        toast.error('Error fetching pending requests.');
      }
    };

    fetchPendingRequests();

    socket.on('new-certificate-request', async (data) => {
      console.log('New certificate request received:', data);
      try {
        const response = await fetch('http://localhost:5000/api/certificate-requests?status=Pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch updated pending requests.');
        const updatedData = await response.json();
        setPendingRequests(updatedData.requests);
        setPendingApprovals(updatedData.requests.length);
      } catch (error) {
        console.error('Error updating pending requests:', error);
      }
    });
    
    return () => {
      // Cleanup WebSocket on component unmount
      socket.off('new-certificate-request');
    };
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Accreditation" value="10" icon={<FiAward />} />
        <DashboardCard title="Linked Accounts" value="150" icon={<FaUserGraduate />} />
        <DashboardCard title="Access Rights" value="120" icon={<FaUserShield />} />
        <DashboardCard title="Pending Approvals" value={pendingApprovals} icon={<FaUserClock />} />
        <DashboardCard title="Change Requests" value="5" icon={<FaExchangeAlt />} />
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Pending Certificate Requests</h3>
        <div className="overflow-auto">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request, index) => (
              <div key={index} className="p-4 border-b border-gray-200">
                <p>
                  <strong>Student:</strong> {request.student.slice(0, 6)}...{request.student.slice(-4)}
                </p>
                <p>
                  <strong>Document Hash:</strong> {request.ipfsHash}
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date(request.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No pending requests at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;*/
