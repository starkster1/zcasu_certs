import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, LinearProgress, Snackbar } from '@mui/material';

const ProfileSection = ({ userName, userEmail, profilePicture }) => {
  const [open, setOpen] = useState(false);
  const [picture, setPicture] = useState(profilePicture || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


   // Fetch profile picture from the backend 
   const fetchProfilePicture = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:5000/api/get-profile-picture', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile picture.');
      }

      const result = await response.json();
      setPicture(result.profilePicture);  // Set the profile picture in the component state
    } catch (error) {
      setError('Error retrieving profile picture');
    }
  };

  // Fetch profile picture when the component mounts
  useEffect(() => {
    fetchProfilePicture();
  }, []);  // Only run on component mount


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setIsUploading(true);
      setError('');

      // Call backend to upload the file
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/update-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture.');
      }

      const result = await response.json();
      setPicture(result.user.profilePicture);  // Update the profile picture with new base64 string
      setIsUploading(false);
      setOpen(false);
      setSuccessMessage('Profile picture uploaded successfully!');
    } catch (error) {
      setError('Failed to upload profile picture. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <aside className="sidebar">
      <div 
        className="profile-section"
        onClick={() => setOpen(true)}  // Clicking on the profile section triggers the dialog
        style={{ cursor: 'pointer' }}
      >
        <div className="profile-pic-wrapper">
          <img
            src={picture ? `data:image/png;base64,${picture}` : 'https://placehold.co/100x100'}
            alt="User Profile"
            className="profile-pic"
            style={{
              borderRadius: '50%',
              border: '2px solid #000',
              width: '100px',
              height: '100px',
            }}
          />
        </div>
        <h2 className="profile-name">{userName}</h2>
        <p className="profile-email"> {userEmail}</p>
        {/* Change button to View Profile */}
        <button className="profile-btn">View Profile</button>
      </div>

      {/* Dialog to prompt user to upload profile picture */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{picture ? "Update Profile Picture" : "Upload Profile Picture"}</DialogTitle>
        <DialogContent>
          <Typography>
            {picture 
              ? "Do you want to update your profile picture?" 
              : "Please upload a formal passport-size photo with a white background."
            }
          </Typography>
          <input type="file" onChange={handleFileChange} accept="image/*" />

          {isUploading && (
            <div style={{ marginTop: 20 }}>
              <Typography>Uploading...</Typography>
              <LinearProgress />
            </div>
          )}

          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </aside>
  );
};

export default ProfileSection;
