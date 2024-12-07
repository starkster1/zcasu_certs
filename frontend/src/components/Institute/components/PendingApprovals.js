import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./PendingApprovals.module.css";
import CertificateViewModal from "./CertificateViewModal"; // Import the modal component

const socket = io("http://localhost:5000"); // Replace with your backend URL

const PendingApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // To hold the selected request for the modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    // Fetch existing pending requests from the backend
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/certificate-requests?status=Pending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch requests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();

    // Listen for real-time updates
    socket.on("certificate-request-notification", (data) => {
      console.log("New certificate request received:", data);
      setRequests((prev) => [...prev, data]); // Add the new request to the list
    });

    return () => {
      socket.off("certificate-request-notification"); // Cleanup on unmount
    };
  }, []);

  // Function to handle opening the modal
  const handleView = (request) => {
    setSelectedRequest(request); // Set the selected request
    setShowModal(true); // Show the modal
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedRequest(null); // Clear the selected request
  };

  // Callback to handle updates to a certificate request
  const handleActionComplete = async (updatedRequest) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req._id === updatedRequest._id ? updatedRequest : req
      )
    );
    handleCloseModal(); // Close the modal after the action
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Pending Approvals</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>#</th> {/* New column */}
              <th className={styles.tableHeader}>Student Number</th>
              <th className={styles.tableHeader}>Request Type</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td> {/* Row number */}
                <td className={styles.tableCell}>{request.studentNumber || "N/A"}</td>
                <td className={styles.tableCell}>{request.metadata.description}</td>
                <td
                  className={`${styles.tableCell} ${
                    request.status === "Pending" ? styles.tableCellPending : ""
                  }`}
                >
                  {request.status}
                </td>
                <td className={styles.tableCellActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleView(request)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className={styles.noRequests}>
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to view certificate */}
      {showModal && selectedRequest && (
        <CertificateViewModal
          request={selectedRequest}
          onClose={handleCloseModal}
          onActionComplete={handleActionComplete} // Pass the handler
        />
      )}
    </div>
  );
};

export default PendingApprovals;



/*import React, { useEffect, useState } from 'react';
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
              <th className={styles.tableHeader}>Request Type</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{request.studentNumber || 'N/A'}</td>
                <td className={styles.tableCell}>{request.metadata.description}</td>
                <td
                  className={`${styles.tableCell} ${
                    request.status === 'Pending' ? styles.tableCellPending : ''
                  }`}
                >
                  {request.status}
                </td>
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
*/