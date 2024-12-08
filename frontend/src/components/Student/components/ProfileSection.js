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
  FaBookReader,
} from "react-icons/fa";
import styles from "./ProfileSection.module.css";
import Loading from "../../../utils/Loading";
import profImage from "../../../assets/prof.jpg";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        window.location.href = "/signup";
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/auth/user-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("User data fetched:", data);
  
        // Set the user state with the fetched data
        setUser({
          role: data.role,
          ethereumAddress: data.profile.ethereumAddress, // Explicitly add ethereumAddress
          ...data.profile, // Include the other profile fields
        });
  
        console.log("User data object:", {
          role: data.role,
          ethereumAddress: data.profile.ethereumAddress,
          ...data.profile,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch user data:", errorData.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const formatEthereumAddress = (ethereumAddress) => {
    return ethereumAddress
      ? `${ethereumAddress.slice(0, 6)}...${ethereumAddress.slice(-4)}`
      : "Address not available";
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Formats to 'YYYY-MM-DD'
  };

  const handleImageUpload = () => {
    console.log("Image upload triggered");
    setShowModal(false);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.ribbon}></div>
        <img
          src={profImage}
          alt="Profile"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
          }}
        />
        <h2 className={styles.profileName}>
          {`${user?.firstName || ""} ${user?.lastName || ""}`}
        </h2>
        <p className={styles.profileRole}>
          <FaLock className={styles.profileIcon} /> {user?.role || "Role not available"}
        </p>
        <p className={styles.profileStudentNumber}>
          <FaGraduationCap className={styles.profileIcon} />{" "}
          {user?.studentNumber || "Student Number not available"}
        </p>
        <p className={styles.profileEmail}>
          <FaEnvelope className={styles.profileIcon} /> {user?.email || "Email not available"}
        </p>
        <p className={styles.profileEthereumAddress}>
          <FaEthereum className={styles.profileIcon} />{" "}
          {formatEthereumAddress(user?.ethereumAddress)}
        </p>
      </div>

      {/* Detail Card */}
      <div className={styles.detailCard}>
        <div className={styles.ribbon}></div>
        <h3>Basic Information</h3>
        <div className={styles.detailContent}>
          <p>
            <FaBookReader className={styles.iconGray} />{" "}
            <strong>Program:</strong> {user?.program || "N/A"}
          </p>
          <p>
            <FaBookReader className={styles.iconGray} />{" "}
            <strong>School:</strong> {user?.schoolOf || "N/A"}
          </p>
          <p>
            <FaCalendarAlt className={styles.iconGray} /> Start:{" "}
            {formatDate(user?.startDate)}
          </p>
          <p>
            <FaCalendarAlt className={styles.iconGray} /> End:{" "}
            {formatDate(user?.endDate)}
          </p>
          <p>
            <FaClock className={styles.iconGray} /> {user?.duration || "N/A"} years
          </p>
          <p>
            <FaLock className={styles.iconGray} /> {user?.accessLevel || "N/A"}
          </p>
          <p>
            <FaGraduationCap className={styles.iconGray} /> {user?.studyLevel || "N/A"}
          </p>
        </div>
      </div>

      {/* Modal for Image Upload */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className="flex justify-between items-center mb-4">
              <h3>Update Profile Picture</h3>
              <button onClick={() => setShowModal(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className={styles.uploadInstructions}>
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
              className={styles.uploadButton}
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
