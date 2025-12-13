import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoImage from '../../assets/logo.jpg'
import './Navbar.css'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?pageSize=1000')
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
          // Group products by category
          const grouped = {}
          data.data.forEach(product => {
            if (!grouped[product.category]) {
              grouped[product.category] = []
            }
            grouped[product.category].push(product)
          })
          setCategoryProducts(grouped)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search query:', searchQuery)
    if (searchQuery.trim()) {
      const searchUrl = `/tim-kiem?q=${encodeURIComponent(searchQuery)}`
      console.log('Navigating to:', searchUrl)
      navigate(searchUrl)
      setSearchQuery('')
      setShowSearchSuggestions(false)
    } else {
      console.log('Empty search query')
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Show suggestions when typing
    if (value.trim().length >= 2) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.brand.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8) // Limit to 8 suggestions
      
      setSearchSuggestions(filtered)
      setShowSearchSuggestions(filtered.length > 0)
    } else {
      setShowSearchSuggestions(false)
      setSearchSuggestions([])
    }
  }

  const handleSuggestionClick = (productId) => {
    navigate(`/thuc-pham-chuc-nang/${productId}`)
    setSearchQuery('')
    setShowSearchSuggestions(false)
  }

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchSuggestions(false)
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const handleCategoryHover = (categoryName) => {
    setActiveCategory(categoryName)
  }

  const handleCategoryLeave = () => {
    setActiveCategory(null)
  }

  const getCategoryProducts = (categoryName) => {
    return categoryProducts[categoryName]?.slice(0, 8) || []
  }

  const categories = [
    { name: 'Vitamin & Khoáng chất', path: '/thuc-pham-chuc-nang?category=Vitamin & Khoáng chất' },
    { name: 'Sinh lý - Nội tiết tố', path: '/thuc-pham-chuc-nang?category=Sinh lý - Nội tiết tố' },
    { name: 'Cải thiện tăng cường chức năng', path: '/thuc-pham-chuc-nang?category=Cải thiện tăng cường chức năng' },
    { name: 'Hỗ trợ điều trị', path: '/thuc-pham-chuc-nang?category=Hỗ trợ điều trị' },
    { name: 'Hỗ trợ tiêu hóa', path: '/thuc-pham-chuc-nang?category=Hỗ trợ tiêu hóa' },
    { name: 'Thần kinh não', path: '/thuc-pham-chuc-nang?category=Thần kinh não' },
    { name: 'Hỗ trợ làm đẹp', path: '/thuc-pham-chuc-nang?category=Hỗ trợ làm đẹp' },
    { name: 'Sức khỏe tim mạch', path: '/thuc-pham-chuc-nang?category=Sức khỏe tim mạch' }
  ]

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
                onChange={handleSearchInputChange}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2 && searchSuggestions.length > 0) {
                    setShowSearchSuggestions(true)
                  }
                }}
                onBlur={() => {
                  // Delay to allow clicking on suggestions
                  setTimeout(() => setShowSearchSuggestions(false), 200)
                }}
                className='search-input'
              />
              <button type='submit' className='search-submit-btn' title='Tìm kiếm'>
                <i className='fi fi-rr-search'></i>
              </button>
            </form>
            
            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className='search-suggestions-dropdown'>
                <div className='suggestions-header'>
                  <span className='suggestions-title'>Sản phẩm gợi ý</span>
                  <span className='suggestions-count'>({searchSuggestions.length} kết quả)</span>
                </div>
                <div className='suggestions-list'>
                  {searchSuggestions.map((product) => (
                    <div
                      key={product._id}
                      className='suggestion-item'
                      onMouseDown={() => handleSuggestionClick(product._id)}
                    >
                      <div className='suggestion-icon'>
                        <i className='fi fi-rr-search'></i>
                      </div>
                      <div className='suggestion-content'>
                        <div className='suggestion-name'>{product.name}</div>
                        <div className='suggestion-meta'>
                          <span className='suggestion-brand'>{product.brand}</span>
                          <span className='suggestion-price'>{product.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='suggestions-footer'>
                  <button 
                    className='view-all-btn'
                    onMouseDown={handleViewAllResults}
                  >
                    Xem tất cả kết quả cho "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}
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
                    <Link to='/tai-khoan' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
                      <i className='fi fi-rr-user'></i>
                      Tài khoản của tôi
                    </Link>
                    <Link to='/don-hang' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
                      <i className='fi fi-rr-document'></i>
                      Đơn hàng của tôi
                    </Link>
                    <Link to='/yeu-thich' className='dropdown-item' onClick={() => setShowUserMenu(false)}>
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
              <Link to='/dang-nhap' className='action-link'>
                <i className='fi fi-br-user action-icon'></i>
                <span className='action-text'>Đăng nhập</span>
              </Link>
            )}
            
            <Link to='/gio-hang' className='action-link'>
              <i className='fi fi-br-shopping-cart action-icon'></i>
              <span className='action-text'>Giỏ hàng</span>
            </Link>
            <Link to='/lien-he' className='action-link'>
              <i className='fi fi-br-phone-call action-icon'></i>
              <span className='action-text'>Liên hệ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className='navbar-categories'>
        <div className='navbar-categories-container'>
          {categories.map((category, index) => (
            <div 
              key={index}
              className='category-wrapper'
              onMouseEnter={() => handleCategoryHover(category.name)}
              onMouseLeave={handleCategoryLeave}
            >
              <Link 
                to={category.path} 
                className='category-link'
              >
                {category.name}
                <i className='fi fi-rr-angle-small-down'></i>
              </Link>
              
              {/* Dropdown Products */}
              {activeCategory === category.name && (
                <div className='category-dropdown'>
                  <div className='dropdown-products'>
                    {getCategoryProducts(category.name).length > 0 ? (
                      <>
                        {getCategoryProducts(category.name).map((product) => (
                          <Link
                            key={product._id}
                            to={`/thuc-pham-chuc-nang/${product._id}`}
                            className='dropdown-product-item'
                            onClick={() => setActiveCategory(null)}
                          >
                            <div className='dropdown-product-name'>{product.name}</div>
                            <div className='dropdown-product-price'>
                              {product.price.toLocaleString('vi-VN')}đ
                            </div>
                          </Link>
                        ))}
                        <Link
                          to={category.path}
                          className='view-all-link'
                          onClick={() => setActiveCategory(null)}
                        >
                          Xem tất cả →
                        </Link>
                      </>
                    ) : (
                      <div className='no-products-dropdown'>Chưa có sản phẩm</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar