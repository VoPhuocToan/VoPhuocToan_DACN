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
        <h2>ADMIN PANEL</h2>
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <p className="user-name">{user?.name || 'Admin HealthyCare'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="nav-link">
              <span className="nav-icon">🛒</span>
              <span>Quản lý đơn hàng</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="nav-link">
              <span className="nav-icon">📦</span>
              <span>Quản lý sản phẩm</span>
            </Link>
          </li>
          <li>
            <Link to="/products/new" className="nav-link">
              <span className="nav-icon">➕</span>
              <span>Thêm sản phẩm</span>
            </Link>
          </li>
          <li>
            <Link to="/categories" className="nav-link">
              <span className="nav-icon">🏷️</span>
              <span>Quản lý khuyến mãi</span>
            </Link>
          </li>
          <li>
            <Link to="/categories" className="nav-link">
              <span className="nav-icon">✨</span>
              <span>Thêm khuyến mãi</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              <span className="nav-icon">👥</span>
              <span>Quản lý người dùng</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              <span className="nav-icon">💬</span>
              <span>Quản lý bình luận</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
