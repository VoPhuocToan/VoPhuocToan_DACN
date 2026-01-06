import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="header-top">
          {!isCollapsed && <h2>ADMIN PANEL</h2>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? '☰' : '◀'}
          </button>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          {!isCollapsed && <p className="user-name">{user?.name || 'Admin HealthyCare'}</p>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} title={isCollapsed ? "Dashboard" : ""}>
              <span className="nav-icon">🏠</span>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`} title={isCollapsed ? "Quản lý đơn hàng" : ""}>
              <span className="nav-icon">🛒</span>
              {!isCollapsed && <span>Quản lý đơn hàng</span>}
            </Link>
          </li>
          <li>
            <Link to="/revenue" className={`nav-link ${isActive('/revenue') ? 'active' : ''}`} title={isCollapsed ? "Thống kê doanh thu" : ""}>
              <span className="nav-icon">💰</span>
              {!isCollapsed && <span>Thống kê doanh thu</span>}
            </Link>
          </li>
          <li>
            <Link to="/products" className={`nav-link ${isActive('/products') && !isActive('/products/performance') ? 'active' : ''}`} title={isCollapsed ? "Quản lý sản phẩm" : ""}>
              <span className="nav-icon">📦</span>
              {!isCollapsed && <span>Quản lý sản phẩm</span>}
            </Link>
          </li>
          <li>
            <Link to="/products/performance" className={`nav-link ${isActive('/products/performance') ? 'active' : ''}`} title={isCollapsed ? "Sản phẩm bán chạy/chậm" : ""}>
              <span className="nav-icon">📊</span>
              {!isCollapsed && <span>Sản phẩm bán chạy/chậm</span>}
            </Link>
          </li>
          <li>
            <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`} title={isCollapsed ? "Danh mục" : ""}>
              <span className="nav-icon">🏷️</span>
              {!isCollapsed && <span>Danh mục</span>}
            </Link>
          </li>
          <li>
            <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`} title={isCollapsed ? "Quản lý người dùng" : ""}>
              <span className="nav-icon">👥</span>
              {!isCollapsed && <span>Quản lý người dùng</span>}
            </Link>
          </li>
          <li>
            <Link to="/promotions" className={`nav-link ${isActive('/promotions') ? 'active' : ''}`} title={isCollapsed ? "Quản lý khuyến mãi" : ""}>
              <span className="nav-icon">🎁</span>
              {!isCollapsed && <span>Quản lý khuyến mãi</span>}
            </Link>
          </li>
          <li>
            <Link to="/comments" className={`nav-link ${isActive('/comments') ? 'active' : ''}`} title={isCollapsed ? "Quản lý bình luận" : ""}>
              <span className="nav-icon">💬</span>
              {!isCollapsed && <span>Quản lý bình luận</span>}
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} title={isCollapsed ? "Liên hệ" : ""}>
              <span className="nav-icon">📧</span>
              {!isCollapsed && <span>Liên hệ</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title={isCollapsed ? "Đăng xuất" : ""}>
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
