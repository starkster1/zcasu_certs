// src/components/AccessRights/AccessRights.js
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




/*// src/components/AccessRights/AccessRights.js
import React from 'react';

const AccessRights = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Access Rights</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">View Certificates</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-2">Modify</button>
                <button className="text-red-600 hover:text-red-900">Revoke</button>
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