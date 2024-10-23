// File: Sidebar.jsx

import React, { useState } from "react";
import {
  FiSettings,
  FiUsers,
  FiUser,
  FiCodepen,
  FiFolder,
  FiAlertTriangle,
} from "react-icons/fi";
import { AiOutlineTeam, AiOutlineCode } from "react-icons/ai";
import { MdWorkspaces, MdDashboard } from "react-icons/md";
import {
  FaUserGraduate,
  FaUserShield,
  FaUserClock,
  FaExchangeAlt,
} from "react-icons/fa";

const Sidebar = ({ onCategorySelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          icon: <MdDashboard />,
          ariaLabel: "Dashboard",
        },
        {
          name: "Linked Accounts",
          icon: <FaUserGraduate />,
          ariaLabel: "Linked Accounts",
        },
        {
          name: "Access Rights",
          icon: <FaUserShield />,
          ariaLabel: "Access Rights",
        },
        {
          name: "Pending Approvals",
          icon: <FaUserClock />,
          ariaLabel: "Pending Approvals",
        },
        {
          name: "Change Institute",
          icon: <FaExchangeAlt />,
          ariaLabel: "Change Institute",
        },
      ],
    },
    {
      title: "Administrative",
      items: [
        {
          name: "Settings",
          icon: <FiSettings />,
          ariaLabel: "Settings",
        },
        {
          name: "User Management",
          icon: <FiUsers />,
          ariaLabel: "User Management",
        },
      ],
    },
    {
      title: "Personal",
      items: [
        {
          name: "Company",
          icon: <AiOutlineTeam />,
          ariaLabel: "Company",
        },
        {
          name: "Developers",
          icon: <AiOutlineCode />,
          ariaLabel: "Developers",
        },
        {
          name: "Profile",
          icon: <FiUser />,
          ariaLabel: "Profile",
        },
        {
          name: "Sandbox Workspace",
          icon: <MdWorkspaces />,
          ariaLabel: "Sandbox Workspace",
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    onCategorySelect(categoryName);
    if (categoryName === "User Management") {
      setError("Failed to load User Management. Please try again later.");
    } else {
      setError(null);
    }
  };

  return (
    <nav
      className={`bg-gray-800 text-white h-screen ${isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out relative`}
    >
      {/* Sidebar Toggler */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FiCodepen className="w-6 h-6" />
          ) : (
            <FiFolder className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.title} className="px-4">
            <h2
              className={`text-xs uppercase font-semibold mb-2 ${isCollapsed ? "sr-only" : ""
                }`}
            >
              {category.title}
            </h2>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleCategoryClick(item.name)}
                    className={`flex items-center space-x-2 w-full p-2 rounded-md transition-colors duration-200 ${activeCategory === item.name ? "bg-blue-600" : "hover:bg-gray-700"
                      }`}
                    aria-label={item.ariaLabel}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded-md flex items-center">
          <FiAlertTriangle className="mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
