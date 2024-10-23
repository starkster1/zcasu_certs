import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting users
import { FaUserGraduate, FaUserShield, FaUserClock, FaExchangeAlt, FaSearch, FaBars, FaCogs } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import './dashboard.css';
import { FiLogOut, FiAward} from 'react-icons/fi';

const InstituteDashboard = () => {
  const [user, setUser] = useState(null);  // Track the logged-in admin user
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false); // State to track if sidebar is collapsed
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchAdminData = async () => {
      const token = localStorage.getItem('authToken');  // Get JWT token from localStorage
      if (!token) {
        console.error('No token found');
        navigate('/signin');  // Redirect to sign-in page if no token
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/admin-profile', {  // Use the user-profile route
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Set the Authorization header with the JWT token
          },
        });
  
        if (response.status === 401) {
          console.error('Unauthorized, invalid token');
          navigate('/signin');  // Redirect if the token is invalid
          return;
        }
  
        if (response.ok) {
          const data = await response.json();
          if (data.role === 'admin') {
            setUser(data);  // Set the admin data
          } else {
            console.error('User is not an admin');
            navigate('/signin');  // Redirect if not admin
          }
        } else {
          console.error('Failed to fetch admin data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
  
    fetchAdminData();
  }, [navigate]);

  // Resize effect to handle collapsing the sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768); // Collapse if screen width is less than 768px
    };

    window.addEventListener("resize", handleResize);  // Add event listener for resize
    handleResize();  // Call it on mount to set the initial state

    return () => window.removeEventListener("resize", handleResize);  // Cleanup the event listener
  }, []);

   // Logout logic
   const handleLogout = () => {
    localStorage.removeItem('authToken');  // Clear JWT token
    localStorage.removeItem('userRole');   // Clear user role (if stored)
    navigate('/signin');  // Redirect to sign-in page
  };

  // If no user is set, show a loading screen
  if (!user) {
    return <div>Loading admin dashboard...</div>;
  }

  const sidebarItems = [
    { id: 'dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { id: 'Accreditation', icon: <FiAward />, label: 'Accreditation'},
    { id: 'linkedAccounts', icon: <FaUserGraduate />, label: 'Linked Accounts' },
    { id: 'accessRights', icon: <FaUserShield />, label: 'Access Rights' },
    { id: 'pendingApprovals', icon: <FaUserClock />, label: 'Pending Approvals' },
    { id: 'changeInstitute', icon: <FaExchangeAlt />, label: 'Change Institute' },
    { id: 'Settings', icon: <FaCogs />, label: 'Settings'},
    { id: 'Logout', icon: <FiLogOut/>, label: 'Logout', action: handleLogout },
  ];

  const dummyStudents = [
    { id: 1, name: 'John Doe', status: 'Approved' },
    { id: 2, name: 'Jane Smith', status: 'Pending' },
    { id: 3, name: 'Alice Johnson', status: 'Rejected' },
    { id: 4, name: 'Bob Brown', status: 'Approved' },
    { id: 5, name: 'Charlie Davis', status: 'Pending' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'linkedAccounts':
        return <LinkedAccounts students={dummyStudents} />;
      case 'accessRights':
        return <AccessRights students={dummyStudents} />;
      case 'pendingApprovals':
        return <PendingApprovals students={dummyStudents} />;
      case 'changeInstitute':
        return <ChangeInstitute students={dummyStudents} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white p-5 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} h-screen`}>
        <div className="flex items-center justify-between mb-8">
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapsible-button"
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Sidebar items */}
        <nav className="overflow-y-auto h-full">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id} className="mb-4">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full p-1 rounded transition-colors ${activeTab === item.id ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
                >
                  <span className="mr-3 text-2xl">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      
    </div>
  );
};


const Dashboard = () => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Accreditation" value="10" icon={<FiAward />} />
      <DashboardCard title="Linked Accounts" value="150" icon={<FaUserGraduate />} />
      <DashboardCard title="Access Rights" value="120" icon={<FaUserShield />} />
      <DashboardCard title="Pending Approvals" value="15" icon={<FaUserClock />} />
      <DashboardCard title="Change Requests" value="5" icon={<FaExchangeAlt />} />
      
    </div>
  </div>
);

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className="rounded-full bg-indigo-100 p-3 mr-4">
      {React.cloneElement(icon, { className: 'text-indigo-600 text-2xl' })}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  </div>
);

const LinkedAccounts = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Linked Accounts</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ height: '20px' }} 
          />
          <button
            className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors"
            style={{ height: '40px' }} 
          >
            <FaSearch />
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AccessRights = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Access Rights</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">View Certificates</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-2">Modify</button>
                <button className="text-red-600 hover:text-red-900">Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PendingApprovals = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
            {/* Make sure this is aligned to the right */}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {students.filter(s => s.status === 'Pending').map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">Certificate Approval</td>
              {/* Ensure buttons are aligned to the right */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="bg-green-500 text-black px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors">
                  Approve
                </button>
                <button className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition-colors">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ChangeInstitute = ({ students }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Change Institute Requests</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Institute</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Institute</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">ZCAS University</td>
              <td className="px-6 py-4 whitespace-nowrap">Requested Institute Name</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="bg-green-500 text-black px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors">Approve</button>
                <button className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition-colors">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default InstituteDashboard;