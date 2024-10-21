import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; 
import React from 'react';
import './StudentDashboard.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import ProfileSection from './components/ProfileSection'; // Import ProfileSection

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const location = useLocation(); 

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
          setUser(data); 
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  if (!user) {
    return <div>Loading...</div>; 
  }

  const getActiveClass = (path) => (location.pathname === path ? 'active' : '');

  const userName = `${user?.firstName || 'First Name'}`;
  const userEmail = user?.email || 'example@example.com';
  const userProfilePicture = user?.profilePicture || '';

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <div className="logo-circle">
            <i className="fas fa-user logo-icon"></i>
          </div>
          <span className="logo-title">ZCASU-Certs</span>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <i className="fas fa-search search-icon"></i>
        </div>
        <div className="notification-container">
          <div className="icon-container">
            <i className="fas fa-bell"></i>
          </div>
          <div className="icon-container">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <ProfileSection
            userName={userName}
            userEmail={userEmail}
            profilePicture={userProfilePicture}
          />

          <nav className="nav-menu">
            <ul>
              <li className={getActiveClass('/dashboard/my-documents')}>
                <Link to="/dashboard/my-documents">
                  <i className="fas fa-file-alt" title="My Documents"></i>
                  <span>My Documents</span>
                </Link>
              </li>
              <li className={getActiveClass('/dashboard/give-access')}>
                <Link to="/dashboard/give-access">
                  <i className="fas fa-user-plus" title="Give Access"></i>
                  <span>Give Access</span>
                </Link>
              </li>
              <li className={getActiveClass('/dashboard/free-access')}>
                <Link to="/dashboard/free-access">
                  <i className="fas fa-unlock" title="Free Access"></i>
                  <span>Free Access</span>
                </Link>
              </li>
              <li className={getActiveClass('/dashboard/change-institute')}>
                <Link to="/dashboard/change-institute">
                  <i className="fas fa-university" title="Change Institute"></i>
                  <span>Change Institute</span>
                </Link>
              </li>
              <li className={getActiveClass('/dashboard/settings')}>
                <Link to="/dashboard/settings">
                  <i className="fas fa-cog" title="Settings"></i>
                  <span>Settings</span>
                </Link>
              </li>
              <li className={getActiveClass('/dashboard/logout')}id="logout-link">
                <Link to="/dashboard/logout">
                  <i className="fas fa-cog" title="Settings"></i>
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="main-content">
          <Outlet /> {/* Render nested routes here */}
        </main>

        {/* Notifications */}
        <aside className="notifications">
          <div className="notifications-box">
            <h2 className="notifications-title">Notifications</h2>
            <p>(Click on the Notification to view)</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;
