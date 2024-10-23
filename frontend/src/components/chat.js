/* import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPaperclip, FaSmile } from "react-icons/fa";
import { format } from "date-fns";

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John", content: "Hey there!", timestamp: new Date(Date.now() - 300000) },
    { id: 2, sender: "You", content: "Hi John! How are you?", timestamp: new Date(Date.now() - 240000) },
    { id: 3, sender: "John", content: "I'm doing great, thanks for asking!", timestamp: new Date(Date.now() - 180000) },
    { id: 4, sender: "You", content: "That's wonderful to hear. Any plans for the weekend?", timestamp: new Date(Date.now() - 120000) },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") {
      setError("Please enter a message");
      return;
    }
    if (inputMessage.length > 500) {
      setError("Message is too long (max 500 characters)");
      return;
    }
    setError("");
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return format(timestamp, "h:mm a");
    return format(timestamp, "MMM d, yyyy");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end space-x-2 ${message.sender === "You" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <FaUser className="text-gray-600" />
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === "You" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                >
                  <p className="font-semibold mb-1">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6">
        {error && (
          <div className="text-red-500 text-sm mb-2" role="alert">
            {error}
          </div>
        )}
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <FaPaperclip className="h-5 w-5" />
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 mr-3 flex items-center justify-center rounded-full h-6 w-6 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <FaSmile className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            onClick={handleSendMessage}
          >
            <span className="font-bold">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 ml-2 transform rotate-90"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
 */



/* import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { format, isToday, isYesterday } from "date-fns";

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hey there! How's it going?",
      timestamp: new Date(2023, 5, 10, 14, 30),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Hi! I'm doing great, thanks for asking. How about you?",
      timestamp: new Date(2023, 5, 10, 14, 35),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const messageEndRef = useRef(null);

  const currentUser = {
    name: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") {
      setError("Message cannot be empty");
      return;
    }

    const newMsg = {
      id: messages.length + 1,
      sender: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      avatar: currentUser.avatar,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setError("");
  };

  const formatTimestamp = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, "h:mm a");
    } else if (isYesterday(timestamp)) {
      return `Yesterday at ${format(timestamp, "h:mm a")}`;
    } else {
      return format(timestamp, "MMM d, yyyy 'at' h:mm a");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser.name ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end space-x-2">
              {message.sender !== currentUser.name && (
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === currentUser.name
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
              {message.sender === currentUser.name && (
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        {error && (
          <p className="text-red-500 text-sm mb-2" role="alert">
            {error}
          </p>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
 */


/* Design a dashboard layout for the application, including navigation
 menus, widgets for displaying key metrics or data summaries, and 
 customizable panels for different modules or features.
 
 Create testimonial that displays a single testimonial from a single customer 
 user.Include fields such as testimonial test, name of the customer 
 giving a testimony and optionally their role or Affiliation
 


 Create a basic Bottom Status Bar component that displays status information 
 at the bottom of the page or application. Include a message or 
 indicator to convey the current status or state of the application.

 Generate a simple sign up form with email and password fields. Design a
  user account creation page with email, password, and terms of service 
  agreement. Create a one page sign up form with email, password, and a
   checkbox for accepting the privacy policy.


   Generate a simple sign up form with first name, last name, student number,
    email and password fields. Design a user account creation page and terms
     of service agreement. Create a one page sign up form and a checkbox for 
     accepting the privacy policy. Add a logo on the right side of the sign up 
     form with text "Welcome to ZCAS University"
    checkbox for accepting the privacy policy.




    Create a login page for Company UI Kit featuring a welcome message and input
     fields for username and password on the left. Include a Remember me checkbox,
      a Forgot Password? link, a Sign In button, and a Sign up now link. On the
       right, display a user testimonial with a quote spanning three 
    lines of text, accompanied by an enlarged user image on a black background, 
    including the user's name and title.

 */

















 /*<html>
<head>
    <title>ZCAS University Sign Up</title>
    <script src="https://unpkg.com/react/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <style>
        body {
            font-family: 'Arial', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div id="root"></div>
    <script type="text/babel">
        function App() {
            return (
                <div className="flex min-h-screen">
                    <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8">
                        <h1 className="text-3xl font-bold text-blue-600 mb-8">Sign Up for ZCAS University</h1>
                        <form className="w-full max-w-sm">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fas fa-user text-gray-400"></i>
                                    </span>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fas fa-user text-gray-400"></i>
                                    </span>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentNumber">
                                    Student Number
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fas fa-id-card text-gray-400"></i>
                                    </span>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="studentNumber"
                                        type="text"
                                        placeholder="12345678"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fas fa-envelope text-gray-400"></i>
                                    </span>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="w-1/2 bg-blue-600 flex flex-col justify-center items-center text-white p-8">
                        <img src="https://placehold.co/50x50" alt="ZCAS University Logo" className="mb-4" />
                        <h1 className="text-3xl font-bold mb-4">Welcome to ZCAS University</h1>
                        <p className="text-center">
                            Join our blockchain verification system for secure and transparent academic records.
                        </p>
                    </div>
                </div>
            );
        }

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>*/




/*import React, { useState } from "react";
import { FaRegBell, FaCalendarAlt, FaUserCircle, FaEnvelope, FaSignInAlt, FaGlobe, FaNewspaper } from "react-icons/fa";
import { Switch } from "@headlessui/react";

const NotificationSettings = () => {
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newSignInAlerts, setNewSignInAlerts] = useState(true);
  const [thirdPartyAccess, setThirdPartyAccess] = useState(false);
  const [newsletterSubscription, setNewsletterSubscription] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleDateFormatChange = (e) => {
    setDateFormat(e.target.value);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Notification Settings</h1>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaCalendarAlt className="text-2xl text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Date Format</h2>
              <p className="text-gray-500">Choose your preferred date format</p>
            </div>
          </div>
          <select
            value={dateFormat}
            onChange={handleDateFormatChange}
            className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select date format"
          >
            <option value="dd/mm/yyyy">dd/mm/yyyy</option>
            <option value="mm/dd/yyyy">mm/dd/yyyy</option>
            <option value="yyyy/mm/dd">yyyy/mm/dd</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaUserCircle className="text-2xl text-green-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Profile Picture Visibility</h2>
              <p className="text-gray-500">Toggle your profile picture visibility</p>
            </div>
          </div>
          <Switch
            checked={profileVisibility}
            onChange={setProfileVisibility}
            className={`${profileVisibility ? "bg-blue-600" : "bg-gray-200"}
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle profile picture visibility</span>
            <span
              className={`${profileVisibility ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaEnvelope className="text-2xl text-purple-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Email Notifications</h2>
              <p className="text-gray-500">Manage email notifications for various events</p>
            </div>
          </div>
          <Switch
            checked={emailNotifications}
            onChange={setEmailNotifications}
            className={`${emailNotifications ? "bg-blue-600" : "bg-gray-200"}
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle email notifications</span>
            <span
              className={`${emailNotifications ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaSignInAlt className="text-2xl text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">New Sign-In Alerts</h2>
              <p className="text-gray-500">Get notified for new sign-ins to your account</p>
            </div>
          </div>
          <Switch
            checked={newSignInAlerts}
            onChange={setNewSignInAlerts}
            className={`${newSignInAlerts ? "bg-blue-600" : "bg-gray-200"}
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle new sign-in alerts</span>
            <span
              className={`${newSignInAlerts ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaGlobe className="text-2xl text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Third-Party App Access</h2>
              <p className="text-gray-500">Control access by third-party applications</p>
            </div>
          </div>
          <Switch
            checked={thirdPartyAccess}
            onChange={setThirdPartyAccess}
            className={`${thirdPartyAccess ? "bg-blue-600" : "bg-gray-200"}
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle third-party app access</span>
            <span
              className={`${thirdPartyAccess ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaNewspaper className="text-2xl text-indigo-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Newsletter Subscription</h2>
              <p className="text-gray-500">Subscribe to our newsletters</p>
            </div>
          </div>
          <Switch
            checked={newsletterSubscription}
            onChange={setNewsletterSubscription}
            className={`${newsletterSubscription ? "bg-blue-600" : "bg-gray-200"}
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle newsletter subscription</span>
            <span
              className={`${newsletterSubscription ? "translate-x-6" : "translate-x-1"}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all ${isSaving ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
*/





/* import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SearchPalette = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dummySuggestions = [
    "React",
    "JavaScript",
    "TailwindCSS",
    "Node.js",
    "GraphQL",
  ];

  const dummyFilters = [
    { id: 1, name: "Category", options: ["Frontend", "Backend", "Full Stack"] },
    { id: 2, name: "Experience", options: ["Beginner", "Intermediate", "Expert"] },
    { id: 3, name: "Language", options: ["JavaScript", "Python", "Java", "C++"] },
  ];

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce((value) => {
      setIsLoading(true);
      // Simulating API call
      setTimeout(() => {
        const filteredSuggestions = dummySuggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setIsLoading(false);
      }, 300);
    }, 300),
    []
  );

  const fetchFilters = useCallback(
    debounce((value) => {
      // Simulating API call for dynamic filters
      setTimeout(() => {
        const relevantFilters = dummyFilters.filter((filter) =>
          filter.options.some((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          )
        );
        setFilters(relevantFilters);
      }, 300);
    }, 300),
    []
  );

  useEffect(() => {
    if (query.length > 0) {
      fetchSuggestions(query);
      fetchFilters(query);
      if (query.length < 3) {
        setError("Please enter at least 3 characters");
      } else {
        setError("");
      }
    } else {
      setSuggestions([]);
      setFilters([]);
      setError("");
    }
  }, [query, fetchSuggestions, fetchFilters]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setFilters([]);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search..."
            className={`w-full p-4 pr-12 text-gray-900 border rounded-lg shadow-sm outline-none transition-all duration-300 ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'}`}
            aria-label="Search input"
          />
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            {query ? <FiX size={20} /> : <FiSearch size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-2"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(suggestions.length > 0 || filters.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {suggestions.length > 0 && (
                <div className="p-4 border-b">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h3>
                  <ul>
                    {suggestions.map((item, index) => (
                      <li key={index} className="py-1">
                        <button className="text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200">
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filters.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggested Filters</h3>
                  {filters.map((filter) => (
                    <div key={filter.id} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">{filter.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {filter.options.map((option, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPalette;
 */








/*import React, { useState, useEffect } from "react";
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaBell, FaCog } from "react-icons/fa";

const BottomStatusBar = () => {
  const [status, setStatus] = useState("normal");
  const [message, setMessage] = useState("All systems operational");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const statuses = ["normal", "warning", "error", "info"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);
      setMessage(getStatusMessage(randomStatus));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getStatusMessage = (currentStatus) => {
    switch (currentStatus) {
      case "normal":
        return "All systems operational";
      case "warning":
        return "Minor issues detected";
      case "error":
        return "Critical error encountered";
      case "info":
        return "System update available";
      default:
        return "Unknown status";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "normal":
        return <FaCheck className="text-green-500" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "error":
        return <FaExclamationTriangle className="text-red-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = () => {
    alert(`Action taken for ${status} status`);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 transition-all duration-300 ease-in-out ${
        isExpanded ? "h-32" : "h-16"
      }`}
      style={{
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to right, #2d3748, #4a5568)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="sr-only" aria-live="polite">
            Current status: {status}
          </span>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-semibold">{message}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAction}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Take action"
          >
            Take Action
          </button>
          <button
            onClick={handleToggleExpand}
            className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            aria-label={isExpanded ? "Collapse status bar" : "Expand status bar"}
          >
            <FaBell className="text-xl" />
          </button>
          <button
            className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            aria-label="Open settings"
          >
            <FaCog className="text-xl" />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 px-4">
          <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
          <p className="text-sm text-gray-300">
            This is where you can display more detailed status information or additional
            controls for the user.
          </p>
        </div>
      )}
    </div>
  );
};

export default BottomStatusBar;*/



/*import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "I've been using this product for months now, and I can't imagine my life without it. It has significantly improved my productivity and streamlined my workflow. The customer support team is also incredibly responsive and helpful. I highly recommend this to anyone looking to boost their efficiency!",
    name: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    text: "As a small business owner, I was skeptical about investing in new software. However, this product has proven to be a game-changer for my company. It's user-friendly, feature-rich, and has helped us save both time and money. I'm impressed with how it has scaled with our growing needs.",
    name: "Michael Chen",
    role: "CEO, TechStart Inc.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    text: "I've tried numerous solutions in the past, but none have come close to the effectiveness of this product. It's intuitive, powerful, and has become an integral part of our daily operations. The regular updates and new features show that the team is committed to continuous improvement. It's a solid investment for any business looking to optimize their processes.",
    name: "Emily Rodriguez",
    role: "Operations Director",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">{testimonials[currentIndex].name}</h3>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </div>
            <blockquote
              className={`text-gray-800 mb-4 overflow-hidden transition-all duration-300 ease-in-out`}
              style={{
                fontSize: `${fontSize}px`,
                maxHeight: isExpanded ? "none" : "6em",
              }}
            >
              <p>{testimonials[currentIndex].text}</p>
            </blockquote>
            {testimonials[currentIndex].text.length > 200 && (
              <button
                onClick={toggleExpand}
                className="text-blue-600 hover:text-blue-800 font-medium"
                aria-label={isExpanded ? "Read less" : "Read more"}
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <button
            onClick={handlePrev}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={24} />
          </button>
          <div className="flex space-x-2">
            <button
              onClick={decreaseFontSize}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={increaseFontSize}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
          <button
            onClick={handleNext}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Next testimonial"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
 


*/