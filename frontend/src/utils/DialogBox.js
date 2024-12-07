import React from 'react';
import './DialogBox.css';

function DialogBox({ show, onConfirm, onCancel, title, message }) {
  if (!show) return null; // Don't render if dialog is not shown

  return (
    <div className="dialog-box">
      <p className="dialog-title">{title}</p>
      <p>{message}</p>
      <div className="button-container">
        <button onClick={onCancel} className="cancel-button">Cancel</button>
        <button onClick={onConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
  );
}

export default DialogBox;
