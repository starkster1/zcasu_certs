import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { FaBars, FaCogs, FaExchangeAlt, FaUserGraduate, FaUserShield, FaUserClock } from 'react-icons/fa';
import { FiMessageSquare, FiLogOut, FiAward, FiSearch, FiBell } from 'react-icons/fi'; // Chat and Notification icons
import Dashboard from './components/Dashboard';
import Accreditation from './components/Accreditation';
import LinkedAccounts from './components/LinkedAccounts';
import AccessRights from './components/AccessRights';
import PendingApprovals from './components/PendingApprovals';
import Profile from './components/Profile';
import NotificationAndMessageDrawer from '../../utils/NotificationAndMessageDrawer';
import './dashboard.css';

const InstituteDashboard = () => {
  const [user, setUser] = useState(null); // Logged-in admin user
  const [students, setStudents] = useState([]); // Real student data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for Notification Drawer
  const [showMessages, setShowMessages] = useState(false); // State for Message Drawer

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/signin');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/admin-profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    const fetchStudents = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const studentData = await response.json();
          setStudents(studentData); // Set real student data here
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchAdminData();
    fetchStudents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  // If no user is set, show a loading screen
  if (!user) {
    return <div>Loading admin dashboard...</div>;
  }

  const sidebarItems = [
    { id: 'dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { id: 'accreditation', icon: <FiAward />, label: 'Accreditation'},
    { id: 'linkedAccounts', icon: <FaUserGraduate />, label: 'Linked Accounts' },
    { id: 'accessRights', icon: <FaUserShield />, label: 'Access Rights' },
    { id: 'pendingApprovals', icon: <FaUserClock />, label: 'Pending Approvals' },
    { id: 'profile', icon: <FaExchangeAlt />, label: 'Profile' },
    { id: 'Settings', icon: <FaCogs />, label: 'Settings' },
    { id: 'Logout', icon: <FiLogOut />, label: 'Logout', action: handleLogout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'accreditation':
        return <Accreditation student={students} />;
      case 'linkedAccounts':
        return <LinkedAccounts students={students} />;
      case 'accessRights':
        return <AccessRights students={students} />;
      case 'pendingApprovals':
        return <PendingApprovals students={students} />;
      case 'profile':
        return <Profile students={students} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Sidebar Wrapper */}
      <div className="sidebar-wrapper">
        <aside className={`bg-gray-800 text-white p-5 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="collapsible-button flex items-center space-x-2">
              <FaBars size={24} />
              {!isCollapsed && <span className="admin-badge">Admin</span>}
            </button>
          </div>
          <nav>
            <ul>
              {sidebarItems.map((item) => (
                <li key={item.id} className="mb-4">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`sidebar-button ${activeTab === item.id ? 'active' : ''}`}
                  >
                    <span className="icon mr-3 text-2xl">{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
  
      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${isCollapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
        {/* Header */}
        <header className="header">
          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>
          {/* Notification and Message Drawers */}
          <NotificationAndMessageDrawer
            showNotifications={showNotifications}
            showMessages={showMessages}
            onClose={() => {
              setShowNotifications(false);
              setShowMessages(false);
            }}
          />
        </header>
  
        {/* Content */}
        <div className="content">{renderContent()}</div>
      </main>
    </div>
  );
  
};

export default InstituteDashboard;