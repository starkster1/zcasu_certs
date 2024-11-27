// src/components/LinkedAccounts.js
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
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeaderActions}>Actions</th>
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







/*import React from 'react';
import { FaSearch } from 'react-icons/fa';

const LinkedAccounts = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Linked Accounts</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors">
            <FaSearch />
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">View</button>
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