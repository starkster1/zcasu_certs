import React, { useEffect, useState } from "react";
import styles from "./AccessRights.module.css";

const AccessRights = () => {
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifiedRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "http://localhost:5000/api/certificate-requests?status=Verified",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching verified requests:", errorData.message);
          return;
        }

        const data = await response.json();
        setVerifiedRequests(data.requests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching verified requests:", error);
      }
    };

    fetchVerifiedRequests();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Access Rights</h2>
      <div className={styles.card}>
        {loading ? (
          <p>Loading verified requests...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Student Number</th>
                <th className={styles.tableHeader}>Document Type</th>
                <th className={styles.tableHeader}>Access Level</th>
                <th className={styles.tableHeaderActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedRequests.map((request) => (
                <tr key={request._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{request.studentNumber}</td>
                  <td className={styles.tableCell}>
                    {request.metadata.documentType || "N/A"}
                  </td>
                  <td className={styles.tableCell}>View Certificates</td>
                  <td className={styles.tableCellActions}>
                    <button
                      className={`${styles.actionButton} ${styles.modifyButton}`}
                    >
                      Modify
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.revokeButton}`}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {verifiedRequests.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.noRequests}>
                    No verified requests available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AccessRights;






/*// src/components/AccessRights/AccessRights.js
import React from 'react';
import styles from './AccessRights.module.css';

const AccessRights = ({ students }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>Access Rights</h2>
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Student Number</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Access Level</th>
            <th className={styles.tableHeaderActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{student.studentNumber}</td>
              <td className={styles.tableCell}>{student.name}</td>
              <td className={styles.tableCell}>View Certificates</td>
              <td className={styles.tableCellActions}>
                <button className={`${styles.actionButton} ${styles.modifyButton}`}>
                  Modify
                </button>
                <button className={`${styles.actionButton} ${styles.revokeButton}`}>
                  Revoke
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AccessRights;
*/