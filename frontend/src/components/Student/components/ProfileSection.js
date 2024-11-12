import React, { useState, useEffect } from "react";
import { FiEdit2, FiMail, FiCreditCard, FiAward, FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import './ProfileSection.css';
import Loading from '../../../utils/Loading';

const ProfileSection = () => {
  const [user, setUser] = useState(null); // Store user data
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        window.location.href = '/signup';
        return;
      }

      const response = await fetch('http://localhost:5000/api/user-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized, token might be invalid');
        window.location.href = '/signup';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched User Data:', data); // Log the response data
        setUser(data); // Save user data
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch data on component mount
  }, []);

  // Utility function to format Ethereum address
  const formatEthereumAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Address not available';
  };

  const handleEmailEdit = () => {
    setNewEmail(user?.email || ""); // Set initial email from fetched user data
    setIsEditingEmail(true);
  };

  const handleEmailSave = () => {
    setUser((prevUser) => ({ ...prevUser, email: newEmail }));
    setIsEditingEmail(false);
  };

  const handleImageUpload = (event) => {
    console.log("Image upload triggered");
    setShowModal(false);
  };

  if (!user) {
    return <Loading/>; // Display loading until user data is fetched
  }

  return (
    <div className="profile-container">
      {/* Left column: Profile details */}
      <div className="profile-card">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
            alt="Profile"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d"; }}
          />
          <button
            onClick={() => setShowModal(true)}
            className="edit-profile-picture-btn"
            aria-label="Edit profile picture"
          >
            <FiEdit2 />
          </button>
          
        </div>
        <h2 className="profile-name">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
          <p className="profile-role">{user?.role || 'Role not available'}</p> 
          <p className="profile-student-number">{user?.studentNumber || 'Student Number not available'}</p> 
          <p className="profile-email">{user?.email || 'Email not available'}</p>
          <p className="profile-ethereum-address">{formatEthereumAddress(user.ethereumAddress)}</p>
      </div>

      

      {/* Right column: Email, transactions, and certificates */}
      <div className="detail-card">
        {/* Email Section */}
        <h3>
          <FiMail /> Email
        </h3>
        <div className="email-field">
          {isEditingEmail ? (
            <div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button onClick={handleEmailSave} className="email-save-btn">Save</button>
            </div>
          ) : (
            <span>{user.email}</span>
          )}
          {!isEditingEmail && (
            <button onClick={handleEmailEdit} className="email-edit-btn">
              <FiEdit2 />
            </button>
          )}
        </div>

        {/* Transactions Section */}
        <h3>
          <FiCreditCard /> Transactions
        </h3>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {user.transactions?.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount}</td>
                  <td>
                    <span className="status-completed">{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Certificates Section */}
        <h3>
          <FiAward /> Certificates
        </h3>
        <div className="certificates-grid">
          {user.certificates?.map((cert) => (
            <div key={cert.id} className="certificate-item">
              <h4>{cert.name}</h4>
              <p>Issued by: {cert.issuer}</p>
              <p>Date: {cert.issueDate}</p>
            </div>
          ))}
        </div>
        
      </div>

      {/* Modal for Profile Picture Upload */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3>Update Profile Picture</h3>
              <button onClick={() => setShowModal(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className="upload-instructions">
              <FiUpload />
              <p>Click to upload or drag and drop</p>
              <p>SVG, PNG, JPG (max. 800x800px)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <button
              onClick={() => document.getElementById("profile-upload").click()}
              className="upload-button"
            >
              Select Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
