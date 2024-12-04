// src/components/LinkedAccounts.js
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './LinkedAccounts.module.css';

const LinkedAccounts = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setStudents(data.users);
        } else {
          console.error('Failed to fetch students:', data.message);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.studentNumber.toString().includes(searchTerm.trim())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Linked Accounts</h2>
      <div className={styles.card}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search by student number..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton}>
            <FaSearch />
          </button>
        </div>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>Student Number</th>
              <th className={styles.tableHeader}>Ethereum Address</th>
              <th className={styles.tableHeader}>Role</th>
            </tr>
          </thead> 
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.studentNumber} className={styles.tableRow}>
                  <td className={styles.tableCell}>{student.studentNumber}</td>
                  <td className={styles.tableCell}>{student.ethereumAddress}</td>
                  <td className={styles.tableCell}>{student.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.noResults}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinkedAccounts;





/*// src/components/LinkedAccounts.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './LinkedAccounts.module.css';

const LinkedAccounts = ({ students }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>Linked Accounts</h2>
    <div className={styles.card}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search students..."
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <FaSearch />
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Student Number</th>
            <th className={styles.tableHeader}>Ethereum Address</th>
            <th className={styles.tableHeaderActions}>Role</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{student.name}</td>
              <td className={styles.tableCell}>
                <span
                  className={`${styles.status} ${
                    student.status === 'Approved'
                      ? styles.statusApproved
                      : student.status === 'Pending'
                      ? styles.statusPending
                      : styles.statusRejected
                  }`}
                >
                  {student.status}
                </span>
              </td>
              <td className={styles.tableCellActions}>
                <button className={styles.viewButton}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LinkedAccounts;
*/