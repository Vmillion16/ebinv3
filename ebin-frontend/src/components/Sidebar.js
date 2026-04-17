import React, { useEffect, useState } from 'react';
import {
  FaTachometerAlt,
  FaTrash,
  FaRecycle,
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import '../index.css';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
    { id: 'bins', label: 'Bin Monitoring', icon: FaTrash },
    { id: 'segregation', label: 'Waste Segregation', icon: FaRecycle },
    { id: 'reports', label: 'Reports', icon: FaChartBar },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      // show sidebar if cursor is near the left side
      if (e.clientX <= 40) {
        setShowSidebar(true);
      } else if (e.clientX > 260) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`sidebar ${showSidebar ? 'show' : ''}`}
      onMouseEnter={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
    >
      <div className="sidebar-header">
        <h3>E-Bin</h3>
        <p>Pambayang Dalubhasaan ng Marilao</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;