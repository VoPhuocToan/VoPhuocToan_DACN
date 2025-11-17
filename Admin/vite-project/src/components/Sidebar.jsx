import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Healthycare Admin</h2>
        <div className="user-info">
          <p>Welcome, <strong>{user?.name || 'Admin'}</strong></p>
          <small>{user?.email}</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">📊 Dashboard</Link>
          </li>
          <li>
            <Link to="/products">🛍️ Products</Link>
          </li>
          <li>
            <Link to="/products/new">➕ Add Product</Link>
          </li>
          <li>
            <Link to="/categories">📑 Categories</Link>
          </li>
          <li>
            <Link to="/contact">💬 Quản Lý Liên Hệ</Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
