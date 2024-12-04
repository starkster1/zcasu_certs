import React, { useState, useEffect } from "react";
import { MdDashboard } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { FiSearch, FiLogOut } from "react-icons/fi";
import { AiOutlineProfile, AiOutlineFileText, AiOutlineSetting } from "react-icons/ai";
import { BsShieldLock, BsUnlock } from "react-icons/bs";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers"; 
import DashboardContent from './components/DashboardContent';
import ProfileSection from './components/ProfileSection';
import MyDocuments from './components/MyDocuments';
import GiveAccess from './components/ProfileSection';
import Settings from './components/Settings';
import Loading from '../../utils/Loading';
import ZCASUCertificate from '../../contracts/ZCASUCertificate.json';
import NotificationAndMessageDrawer from '../../utils/NotificationAndMessageDrawer';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [isWaving, setIsWaving] = useState(true);
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState(null);   // Add state for contract
  const [accounts, setAccounts] = useState([]);     // Add state for accounts
  const [showNotifications, setShowNotifications] = useState(false); // State for Notification Drawer
  const [showMessages, setShowMessages] = useState(false); // State for Message Drawer
  
  const contractAddress = "0xA39e30e17F63F8b6AD4CE2ddcfb76fC36FE2444f";
  const instituteAddress = "0x6dc1a3e5cED96bd6E53C03669E2c3119B129Ac1B";


  useEffect(() => {
    console.log("Certificate Contract Address:", contractAddress);
    console.log("The institute Address:", instituteAddress);

    // Initialize the blockchain connection and contract
    const initializeBlockchainData = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask is not installed!");
          return;
        }
        
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize provider and signer
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Initialize the contract instance with signer
        const contractInstance = new Contract(
          contractAddress,
          ZCASUCertificate.abi,
          signer
        );

        // Get user accounts
        const userAccounts = await provider.listAccounts();
        
        setContract(contractInstance);
        setAccounts(userAccounts);
        
        console.log("Contract initialized:", contractInstance);
        console.log("Accounts loaded:", userAccounts);
      } catch (error) {
        console.error("Error initializing contract or fetching accounts:", error);
      }
    };

    // Fetch user profile data from backend
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
    initializeBlockchainData();

    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  // Display a loading message if user data or blockchain data is not yet loaded
  if (!user || !contract || accounts.length === 0) {
    return <Loading/>; 
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Render content based on selected section
  const renderContent = () => {
    switch (selectedSection) {
      case 'Dashboard':
        return <DashboardContent userName={user.firstName} isWaving={isWaving} />;
      case 'My Documents':
        // Pass contract and accounts as props to MyDocuments
        return <MyDocuments contractAddress={contractAddress} instituteAddress={instituteAddress} />;
      case 'Profile':
        return <ProfileSection />;
      case 'Give Access':
        return <GiveAccess />;  
      case 'Settings':
        return <Settings />;    
      default:
        return <DashboardContent userName={user.firstName} isWaving={isWaving} />;
    }
  };

  const SidebarItem = ({ icon, text, section }) => (
    <div className={styles.sidebarItem}>
      <button
        onClick={() => setSelectedSection(section)}
        className={`${styles.sidebarBtn} ${selectedSection === section ? styles.active : ''}`}
      >
        <div className={styles.iconContainer}>{icon}</div>
        {isSidebarOpen && <span>{text}</span>}
      </button>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.expanded : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          {isSidebarOpen && <h2 className={styles.dashboardTitle}>ZCAS University</h2>}
          <button onClick={toggleSidebar} className={styles.toggleSidebarBtn}>
            <FaBars className={`${isSidebarOpen ? styles.rotate180 : ''}`} />
            
          </button>
        </div>

        <nav>
          <SidebarItem icon={<MdDashboard />} text="Dashboard" section="Dashboard" />
          <SidebarItem icon={<AiOutlineProfile />} text="Profile" section="Profile" />
          <SidebarItem icon={<AiOutlineFileText />} text="My Documents" section="My Documents" />
          <SidebarItem icon={<BsShieldLock />} text="Give Access" section="Give Access" />
          <SidebarItem icon={<BsUnlock />} text="Free Access" section="Free Access" />
          <SidebarItem icon={<AiOutlineSetting />} text="Settings" section="Settings" />
          <SidebarItem icon={<FiLogOut />} text="Logout" section="Logout" />
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
            <FiSearch className={styles.searchIcon} />
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
        <div className={styles.dashboardScrollableContent}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default StudentDashboard;
