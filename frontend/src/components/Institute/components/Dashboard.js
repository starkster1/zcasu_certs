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
  const [linkedAccounts, setLinkedAccounts] = useState(0);
  const [accessRights, setAccessRights] = useState(0); // Add state for access rights
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending requests
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

  // Fetch linked accounts
  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch linked accounts.');
      const data = await response.json();
      setLinkedAccounts(data.users.length); // Update linked accounts count
    } catch (error) {
      toast.error('Error fetching linked accounts.');
      console.error('Error:', error);
    }
  };

  // Fetch access rights
  const fetchAccessRights = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/certificate-requests?status=Verified', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch access rights.');
      const data = await response.json();
      setAccessRights(data.requests.length); // Update access rights count
    } catch (error) {
      toast.error('Error fetching access rights.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchLinkedAccounts();
    fetchAccessRights();

    socket.on('new-certificate-request', async () => {
      console.log('New certificate request received');
      fetchPendingRequests();
      fetchAccessRights(); // Update access rights dynamically
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
        <DashboardCard title="Accreditation" value="1" icon={<FiAward />} />
        <DashboardCard title="Linked Accounts" value={linkedAccounts} icon={<FaUserGraduate />} />
        <DashboardCard title="Access Rights" value={accessRights} icon={<FaUserShield />} />
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
                {/* Add Ribbon */}
                <div className={styles.ribbon}></div>

                {/* Request Details */}
                <p className={styles.requestField}>
                  <strong>Student Number:</strong> {request.studentNumber || 'N/A'}
                </p>
                <p className={styles.requestField}>
                  <strong>Request ID:</strong> {request._id || 'N/A'}
                </p>
                <p className={styles.requestField}>
                  <strong>Document Hash:</strong> {request.ipfsHash || 'N/A'}
                </p>
                <p className={styles.requestField}>
                  <strong>Status:</strong> {request.status || 'N/A'}
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
