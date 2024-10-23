import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To get current path
import {
  FiSearch,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import {
  AiOutlineProfile,
  AiOutlineFileText,
  AiOutlineSetting,
} from "react-icons/ai";
import { BsPersonBadge, BsShieldLock, BsUnlock } from "react-icons/bs";
import "./StudentDashboard.css"; // Importing the CSS file for the layout and styling

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null); // New state for user data
  const location = useLocation(); // Get the current path for active links

  // Fetch user data and handle authentication on mount
  useEffect(() => {
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
          setUser(data); // Save user data
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  // Display a loading message if user data is not yet loaded
  if (!user) {
    return <div>Loading...</div>; 
  }

  // Function to handle active class for the current location
  const getActiveClass = (path) => (location.pathname === path ? 'active' : '');

  // Extract user details or provide default values
  const userName = `${user?.firstName || 'First Name'}`;
  const userEmail = user?.email || 'example@example.com';
  const userProfilePicture = user?.profilePicture || '';

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const SidebarItem = ({ icon, text, onClick, isOpen, children }) => (
    <div className="sidebar-item mb-2">
      <button
        className="sidebar-btn flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
        onClick={onClick}
      >
        {icon}
        {isSidebarOpen && (
          <>
            <span className="ml-3">{text}</span>
            {children && (
              <span className="ml-auto">
                {isOpen ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
          </>
        )}
      </button>
      {children && isOpen && isSidebarOpen && (
        <div className="ml-4 mt-2">{children}</div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarOpen ? "w-64" : "w-20"} transition-all`}
      >
        <div className="flex justify-between items-center mb-6">
          {isSidebarOpen && <h2 className="dashboard-title">ZCAS Dashboard</h2>}
          <button
            onClick={toggleSidebar}
            className="toggle-sidebar-btn"
            aria-label="Toggle Sidebar"
          >
            <FiChevronRight
              className={`transform ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav>
          <SidebarItem
            icon={<AiOutlineProfile className="text-xl" />}
            text="Profile"
            onClick={toggleProfile}
            isOpen={isProfileOpen}
          >
            <SidebarItem icon={<BsPersonBadge />} text="View Profile" />
            <SidebarItem icon={<AiOutlineFileText />} text="Edit Profile" />
          </SidebarItem>
          <SidebarItem
            icon={<AiOutlineFileText className="text-xl" />}
            text="Registration"
          />
          <SidebarItem
            icon={<AiOutlineFileText className="text-xl" />}
            text="My Documents"
          />
          <SidebarItem
            icon={<BsShieldLock className="text-xl" />}
            text="Give Access"
          />
          <SidebarItem
            icon={<BsUnlock className="text-xl" />}
            text="Free Access"
          />
          <SidebarItem
            icon={<AiOutlineSetting className="text-xl" />}
            text="Settings"
          />
          <SidebarItem icon={<FiLogOut className="text-xl" />} text="Logout" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>

          {/* Display User Profile */}
          <div className="user-profile flex items-center">
            <img
              src={userProfilePicture || "/default-profile.png"}
              alt="User Profile"
              className="profile-picture"
            />
            <div className="ml-3">
              <h3 className="user-name">{userName}</h3>
              <p className="user-email">{userEmail}</p>
            </div>
            <button className="profile-btn" aria-label="User Profile">
              <FiUser className="text-xl" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="dashboard-heading">Welcome to Your Dashboard</h1>

          {/* Blockchain Certificate Verification System Placeholder */}
          <section className="dashboard-section mb-6">
            <h2 className="section-title">Blockchain Certificate Verification</h2>
            <p className="section-text">
              This section will include features for verifying certificates
              using blockchain technology. Implementation details will be
              handled by backend services.
            </p>
            <button className="verify-btn">Verify Certificate</button>
          </section>

          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="dashboard-section">
              <h3 className="section-title">Recent Activity</h3>
              <ul className="section-list">
                <li>Completed Course: Web Development</li>
                <li>Submitted Assignment: Data Structures</li>
                <li>Registered for: Machine Learning 101</li>
              </ul>
            </div>
            <div className="dashboard-section">
              <h3 className="section-title">Upcoming Events</h3>
              <ul className="section-list">
                <li>Guest Lecture: AI in Education (Tomorrow)</li>
                <li>Mid-term Exams (Next Week)</li>
                <li>Career Fair (In 2 Weeks)</li>
              </ul>
            </div>
            <div className="dashboard-section">
              <h3 className="section-title">Quick Links</h3>
              <ul className="section-list">
                <li>
                  <a href="#" className="quick-link">
                    Course Catalog
                  </a>
                </li>
                <li>
                  <a href="#" className="quick-link">
                    Student Handbook
                  </a>
                </li>
                <li>
                  <a href="#" className="quick-link">
                    Academic Calendar
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
