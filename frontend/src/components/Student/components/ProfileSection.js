import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { 
  FaEthereum, 
  FaEnvelope,
  FaCalendarAlt, 
  FaGraduationCap, 
  FaClock, 
  FaLock, 
  FaBookReader 
} from "react-icons/fa";
import './ProfileSection.css';
import Loading from '../../../utils/Loading';
import profImage from '../../../assets/prof.jpg';

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        window.location.href = '/signup';
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/user-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data fetched:', data);
        setUser({
          role: data.role,
          ...data.profile,
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user data:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  
  useEffect(() => {
    fetchUserData();
  }, []);

  const formatEthereumAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Address not available';
  };

  const handleImageUpload = () => {
    console.log("Image upload triggered");
    setShowModal(false);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="profile-container">
      {/* Profile Card */}
        <div className="profile-card">
          <div className="ribbon"></div> {/* Ribbon */}
          <img
            src={profImage}
            alt="Profile"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
            }}
          />
          <h2 className="profile-name">
              {`${user?.firstName || ''} ${user?.lastName || ''}`}
          </h2>
          <p className="profile-role">
            <FaLock className="profile-icon" /> {user?.role || 'Role not available'}
          </p>
          <p className="profile-student-number">
            <FaGraduationCap className="profile-icon" /> {user?.studentNumber || 'Student Number not available'}
          </p>
          <p className="profile-email">
            <FaEnvelope className="profile-icon" /> {user?.email || 'Email not available'}
          </p>
          <p className="profile-ethereum-address">
            <FaEthereum className="profile-icon" /> {formatEthereumAddress(user?.ethereumAddress)}
          </p>
        </div>


      {/* Detail Card */}
      <div className="detail-card">
        <div className="ribbon"></div> {/* Ribbon */}
        <h3>
           Basic Information
        </h3>
         <div className="detail-content">
          <p><FaBookReader className="icon-gray" /> <strong></strong> {user?.program || 'N/A'}</p>
          <p><FaBookReader className="icon-gray" /> <strong></strong> {user?.schoolOf || 'N/A'}</p>
          <p><FaCalendarAlt className="icon-gray" /> Start: {user?.startDate || 'N/A'}</p>
          <p><FaCalendarAlt className="icon-gray" /> End:{user?.endDate || 'N/A'}</p>
          <p><FaClock className="icon-gray" /> {user?.duration || 'N/A'} years</p>
          <p><FaLock className="icon-gray" /> {user?.accessLevel || 'N/A'}</p>
          <p><FaGraduationCap className="icon-gray" /> {user?.studyLevel || 'N/A'}</p>
        </div>
      </div>

      {/* Modal for Image Upload */}
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
