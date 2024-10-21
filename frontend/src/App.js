import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignUp from "./components/Student/SignUp";
import SignIn from "./components/Student/SignIn";
import Wallet from "./utils/Wallet"; 
import { connectToMetaMask } from "./utils/metamask"; 
import StudentDashboard from "./components/Student/StudentDashboard"; 
import InstituteDashboard from "./components/Institute/InstituteDashboard";
import MyDocuments from "./components/Student/components/MyDocuments";
import GiveAccess from "./components/Student/components/GiveAccess";
import FreeAccess from "./components/Student/components/FreeAccess";
import ChangeInstitute from "./components/Student/components/ChangeInstitute";
import Settings from "./components/Student/components/Settings";

const App = () => {
  const [userProfile, setUserProfile] = useState(null); 
  const [account, setAccount] = useState(null);  
  const [metaMaskError, setMetaMaskError] = useState("");  

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const ethAddress = await connectToMetaMask();  
        setAccount(ethAddress);  
      } catch (error) {
        setMetaMaskError(error.message);  
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');  // Get JWT token from localStorage
      const userRole = localStorage.getItem('userRole');  // Get user role (admin or student)
    
      if (token) {
        try {
          // Determine which profile endpoint to call based on the role
          const profileUrl = userRole === 'admin' 
            ? 'http://localhost:5000/api/admin-profile'   // Admin profile route
            : 'http://localhost:5000/api/user-profile';   // Student profile route
    
          const response = await fetch(profileUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,  // Set Authorization header with JWT token
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            setUserProfile({ ...data, role: userRole });  // Include role in user profile
          } else {
            console.error('Failed to fetch user profile. Status:', response.status);
            localStorage.removeItem('authToken');  // Clear token if invalid
            localStorage.removeItem('userRole');   // Clear user role if invalid
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    connectWallet();
    fetchUserProfile();  // Fetch user profile if token is available
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={
            account ? (
              <SignUp account={account} setUserProfile={setUserProfile} />
            ) : (
              <div>{metaMaskError || "Please connect to MetaMask"}</div>
            )
          }
        />
        <Route
          path="/signin"
          element={
            account ? (
              <SignIn account={account} setUserProfile={setUserProfile} />
            ) : (
              <div>{metaMaskError || "Please connect to MetaMask"}</div>
            )
          }
        />
        <Route
          path="/wallet"
          element={
            account ? (
              <Wallet account={account} />
            ) : (
              <div>{metaMaskError || "Please connect to MetaMask"}</div>
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            userProfile && userProfile.role === 'student' ? (
              <StudentDashboard user={userProfile} />
            ) : (
              <div>Please sign in to access the student dashboard.</div>
            )
          }
        >
          <Route path="my-documents" element={<MyDocuments />} />
          <Route path="give-access" element={<GiveAccess />} />
          <Route path="free-access" element={<FreeAccess />} />
          <Route path="change-institute" element={<ChangeInstitute />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Add InstituteDashboard route for Admin */}
        <Route
          path="/admin/dashboard"
          element={
            userProfile && userProfile.role === 'admin' ? (
              <InstituteDashboard user={userProfile} />
            ) : (
              <div>Please sign in to access the admin dashboard.</div>
            )
          }
        />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;