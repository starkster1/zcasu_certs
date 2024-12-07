import React from 'react';
import { Button } from '@mui/material';
import { FiCheckCircle, FiClock } from 'react-icons/fi'; // Icons for verified and pending statuses
import logo from '../../../assets/logo.png'; // Adjust the path based on your folder structure
import styles from './CertificateCard.module.css';

const CertificateCard = ({ index, doc, account, onView }) => (
  <div className={styles.card}>
    {/* Ribbon */}
    <div className={styles.ribbon}>ZCAS University</div>

    {/* Header */}
    <div className={styles.header}>
      {/* University Logo */}
      <img
        src={logo} // Replace with the actual logo path
        alt="ZCAS University Logo"
        className={styles.logo}
      />
      {/* Certificate Title */}
      <h3 className={styles.title}>Certificate</h3>
    </div>

    {/* Content Section */}
    <div className={styles.content}>
      <div className={styles.details}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Date:</span>
          <span className={styles.infoValue}>
            {new Date(Number(doc.timestamp) * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status:</span>
          <span
            className={`${styles.infoValue} ${
              doc.status === 'Pending' ? styles.pendingText : styles.verifiedText
            }`}
          >
            {doc.status}
          </span>
          <div className={styles.iconContainer}>
            {doc.status === 'Pending' ? (
              <FiClock className={styles.pendingIcon} />
            ) : (
              <FiCheckCircle className={styles.verifiedIcon} />
            )}
          </div>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Uploader:</span>
          <span className={styles.infoValue}>
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>

    {/* View Button */}
    <Button className={styles.viewButton} onClick={onView}>
      View Certificate
    </Button>
  </div>
);

export default CertificateCard;
