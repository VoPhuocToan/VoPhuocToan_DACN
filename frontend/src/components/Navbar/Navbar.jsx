import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoImage from '../../assets/logo.jpg'
import './Navbar.css'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <nav className='navbar'>
      {/* Main Navigation */}
      <div className='navbar-main'>
        <div className='navbar-main-container'>
          <Link to='/' className='navbar-logo'>
            <img src={logoImage} alt='HealthyCare Logo' className='logo-image' />
          </Link>

          <div className='search-container'>
            <form onSubmit={handleSearch} className='search-form'>
              <input
                type='text'
                placeholder='Tìm tên thuốc, bệnh lý, TP'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-input'
              />
              <button type='submit' className='search-submit-btn' title='Tìm kiếm'>
                <i className='fi fi-rr-search'></i>
              </button>
            </form>
          </div>

          <div className='navbar-actions'>
            {isAuthenticated && user ? (
              <div className='user-menu'>
                <button 
                  className='user-menu-btn'
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className='user-avatar'>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <i className='fi fi-br-user'></i>
                    )}
                  </div>
                  <span className='user-name'>{user.name.split(' ').slice(-1)[0]}</span>
                  <i className={`fi fi-rr-angle-small-down ${showUserMenu ? 'active' : ''}`}></i>
                </button>

                {showUserMenu && (
                  <div className='user-dropdown'>
                    <div className='user-info'>
                      <p className='user-email'>{user.email}</p>
                      {user.role === 'admin' && <span className='admin-badge'>👨‍💼 Admin</span>}
                    </div>
                    <Link to='#' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
                      <i className='fi fi-rr-user'></i>
                      Tài khoản của tôi
                    </Link>
                    <Link to='#' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
                      <i className='fi fi-rr-document'></i>
                      Đơn hàng của tôi
                    </Link>
                    <Link to='#' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
                      <i className='fi fi-rr-heart'></i>
                      Sản phẩm yêu thích
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <div className='dropdown-divider'></div>
                        <Link to='/admin' className='dropdown-item admin-link' onClick={() => setShowUserMenu(false)}>
                          <i className='fi fi-rr-settings'></i>
                          Trang quản lý
                        </Link>
                      </>
                    )}
                    <div className='dropdown-divider'></div>
                    <button className='dropdown-item logout-btn' onClick={handleLogout}>
                      <i className='fi fi-rr-exit'></i>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to='/dang-nhap' className='action-link'>
                  <i className='fi fi-br-user action-icon'></i>
                  <span className='action-text'>Đăng nhập</span>
                </Link>
                <Link to='/dang-ky' className='action-link'>
                  <i className='fi fi-rr-user-add action-icon'></i>
                  <span className='action-text'>Đăng ký</span>
                </Link>
              </>
            )}
            
            <Link to='/gio-hang' className='action-link'>
              <i className='fi fi-sr-shopping-cart action-icon'></i>
              <span className='action-text'>Giỏ hàng</span>
            </Link>
            <Link to='/lien-he' className='action-link'>
              <i className='fi fi-br-phone-call action-icon'></i>
              <span className='action-text'>Liên hệ</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar