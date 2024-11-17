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
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [isWaving, setIsWaving] = useState(true);
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState(null);   // Add state for contract
  const [accounts, setAccounts] = useState([]);     // Add state for accounts
  
  const contractAddress = "0x303C82A0B8dCb9113Dad47180806296ceE081b0c";
  const instituteAddress = "0x4e590Dc11cE71637F5D525fe1d8768226ae8575E";


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
    <div className="sidebar-item mb-2">
      <button
        onClick={() => setSelectedSection(section)}
        className={`sidebar-btn flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-700 transition-colors ${selectedSection === section ? 'active' : ''}`}
      >
        <div className="icon-container" style={{ fontSize: '24px' }}>
          {icon}
        </div>
        {isSidebarOpen && <span className="ml-3">{text}</span>}
      </button>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`sidebar ${isSidebarOpen ? "w-64" : "w-20"} transition-all`}>
        <div className="flex justify-between items-center mb-6">
          {isSidebarOpen && <h2 className="dashboard-title">ZCAS University</h2>}
          <button onClick={toggleSidebar} className="toggle-sidebar-btn">
            <FaBars className={`transform ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav>
          <SidebarItem icon={<MdDashboard />} text="Dashboard" section="Dashboard" />
          <SidebarItem icon={<AiOutlineProfile />} text="Personal Information" section="Profile" />
          <SidebarItem icon={<AiOutlineFileText />} text="My Documents" section="My Documents" />
          <SidebarItem icon={<BsShieldLock />} text="Give Access" section="Give Access" />
          <SidebarItem icon={<BsUnlock />} text="Free Access" section="Free Access" />
          <SidebarItem icon={<AiOutlineSetting />} text="Settings" section="Settings" />
          <SidebarItem icon={<FiLogOut />} text="Logout" section="Logout" />
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <div className="search-bar">
              <input type="text" placeholder="Search..." className="search-input" />
              <FiSearch className="search-icon" />
            </div>
          </div>
        </header>

        <div className="dashboard-scrollable-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
  
};


export default StudentDashboard;






/*import React, { useState, useEffect } from "react";
import { MdDashboard } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { FiSearch, FiLogOut } from "react-icons/fi";
import { AiOutlineProfile, AiOutlineFileText, AiOutlineSetting } from "react-icons/ai";
import { BsShieldLock, BsUnlock } from "react-icons/bs";
import { Bell, MessageSquare } from 'lucide-react'; // Notification and Message icons
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers"; 
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import DashboardContent from './components/DashboardContent';
import ProfileSection from './components/ProfileSection';
import MyDocuments from './components/MyDocuments';
import GiveAccess from './components/GiveAccess';
import Settings from './components/Settings';
import NotificationDrawer from '../Notifications/NotificationDrawer';
import MessageDrawer from '../Messaging/MessageDrawer';
import Loading from '../../utils/Loading';
import ZCASUCertificate from '../../contracts/ZCASUCertificate.json';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [isWaving, setIsWaving] = useState(true);
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  
  const contractAddress = "0xf085504Be507EC6E2805eD95963f7814104FA60a";
  const instituteAddress = "0x1E72106F5935568E6489a5A42E5c3E71b58967f5";

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
      const contractInstance = new Contract(contractAddress, ZCASUCertificate.abi, signer);

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

    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          window.location.href = '/signup';
          return;
        }

        const response = await fetch('http://localhost:5000/api/user-profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
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

    // Initialize socket connection for real-time notifications and messages
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    const userAddress = localStorage.getItem('userAddress');
    if (userAddress) {
      newSocket.emit('join', userAddress);
    }

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      setUnreadNotifications((prev) => prev + 1);
      toast.success(notification.message);
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      toast.success('New message received');
    });

    fetchUserData();
    initializeBlockchainData();

    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      newSocket.close();
    };
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => notif.id === id ? { ...notif, read: true } : notif));
    setUnreadNotifications((prev) => Math.max(0, prev - 1));
  };

  const handleSendMessage = (content) => {
    if (socket) {
      socket.emit('message', {
        content,
        from: localStorage.getItem('userAddress') || '',
        timestamp: Date.now()
      });
    }
  };

  // Display a loading message if user data or blockchain data is not yet loaded
  if (!user || !contract || accounts.length === 0) {
    return <Loading/>; 
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (selectedSection) {
      case 'Dashboard':
        return <DashboardContent userName={user?.firstName} isWaving={isWaving} />;
      case 'My Documents':
        return <MyDocuments contractAddress={contractAddress} instituteAddress={instituteAddress} />;
      case 'Profile':
        return <ProfileSection />;
      case 'Give Access':
        return <GiveAccess />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardContent userName={user?.firstName} isWaving={isWaving} />;
    }
  };

  const SidebarItem = ({ icon, text, section }) => (
    <div className="sidebar-item mb-2">
      <button
        onClick={() => setSelectedSection(section)}
        className={`sidebar-btn flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-700 transition-colors ${selectedSection === section ? 'active' : ''}`}
      >
        <div className="icon-container" style={{ fontSize: '24px' }}>{icon}</div>
        {isSidebarOpen && <span className="ml-3">{text}</span>}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`sidebar ${isSidebarOpen ? "w-64" : "w-20"} transition-all`}>
        <div className="flex justify-between items-center mb-6">
          {isSidebarOpen && <h2 className="dashboard-title">ZCAS University</h2>}
          <button onClick={toggleSidebar} className="toggle-sidebar-btn">
            <FaBars className={`transform ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav>
          <SidebarItem icon={<MdDashboard />} text="Dashboard" section="Dashboard" />
          <SidebarItem icon={<AiOutlineProfile />} text="Personal Information" section="Profile" />
          <SidebarItem icon={<AiOutlineFileText />} text="My Documents" section="My Documents" />
          <SidebarItem icon={<BsShieldLock />} text="Give Access" section="Give Access" />
          <SidebarItem icon={<BsUnlock />} text="Free Access" section="Free Access" />
          <SidebarItem icon={<AiOutlineSetting />} text="Settings" section="Settings" />
          <SidebarItem icon={<FiLogOut />} text="Logout" section="Logout" />
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content flex items-center justify-between">
            <div className="search-bar">
              <input type="text" placeholder="Search..." className="search-input" />
              <FiSearch className="search-icon" />
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsNotificationDrawerOpen(true)} className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMessageDrawerOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
                <MessageSquare className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-scrollable-content">
          {renderContent()}
        </div>
      </main>

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
      <MessageDrawer
        isOpen={isMessageDrawerOpen}
        onClose={() => setIsMessageDrawerOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default StudentDashboard;*/