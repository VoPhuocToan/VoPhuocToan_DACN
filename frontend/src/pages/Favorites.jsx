import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Favorites.css'

// Import all images from assets folder
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

// Component to handle product image display with error handling
const ProductImage = ({ image, name, resolveImageSrc }) => {
  const [imageError, setImageError] = useState(false)
  const imageSrc = resolveImageSrc(image)

  useEffect(() => {
    setImageError(false)
  }, [image])

  if (!imageSrc || imageError) {
    return (
      <div className="no-image">
        <i className="fi fi-rr-picture"></i>
      </div>
    )
  }

  return (
    <img 
      src={imageSrc} 
      alt={name}
      onError={() => setImageError(true)}
    />
  )
}

const Favorites = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Function to resolve image source similar to ProductCard
  const resolveImageSrc = (img) => {
    if (!img) return ''
    const imgStr = String(img)
    
    // If it's already a full URL, return it
    if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
      return imgStr
    }
    
    // If it's a server upload path (starts with /uploads), prepend API URL
    if (imgStr.startsWith('/uploads')) {
      return `${apiUrl}${imgStr}`
    }
    
    // Look for the image in our imported images (local assets)
    const imagePath = `../assets/${imgStr}`
    if (images[imagePath]) {
      return images[imagePath]
    }
    
    // If not found, return empty string to trigger no-image fallback
    console.warn(`Image not found: ${imgStr}`)
    return ''
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap')
      return
    }
    loadFavorites()
  }, [isAuthenticated, navigate])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiUrl}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setFavorites(data.data || [])
      } else {
        console.error('Error loading favorites:', data.message)
        setFavorites([])
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromFavorites = async (productId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiUrl}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setFavorites(prev => prev.filter(item => item._id !== productId))
        // Dispatch event để cập nhật các component khác
        window.dispatchEvent(new Event('favoritesUpdated'))
      } else {
        alert(data.message || 'Không thể xóa khỏi danh sách yêu thích')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Lỗi khi xóa khỏi danh sách yêu thích')
    }
  }

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/dang-nhap')
      return
    }

    try {
      const userId = localStorage.getItem('userId') || `guest_${Date.now()}`
      if (!localStorage.getItem('userId')) localStorage.setItem('userId', userId)

      const payload = {
        userId,
        quantity: 1,
        productId: product._id,
        clientProductId: String(product._id),
        productData: {
          name: product.name,
          price: product.price,
          image: product.image
        }
      }

      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (data.success) {
        alert('Đã thêm vào giỏ hàng!')
      } else {
        alert(data.message || 'Không thể thêm vào giỏ hàng')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Lỗi khi thêm vào giỏ hàng')
    }
  }

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <div className="favorites-wrapper">
        <div className="favorites-header">
          <h1>Sản phẩm yêu thích</h1>
          <p>Danh sách {favorites.length} sản phẩm bạn đã lưu</p>
        </div>

        {favorites.length === 0 ? (
          <div className="no-favorites">
            <div className="no-favorites-icon">💔</div>
            <h3>Chưa có sản phẩm yêu thích</h3>
            <p>Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi dễ dàng hơn</p>
            <Link to="/thuc-pham-chuc-nang" className="browse-btn">
              <i className="fi fi-rr-search"></i>
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((product) => (
              <div key={product._id} className="favorite-card">
                <button 
                  className="remove-btn"
                  onClick={() => removeFromFavorites(product._id)}
                  title="Xóa khỏi yêu thích"
                >
                  <i className="fi fi-rr-cross"></i>
                </button>

                <Link to={`/thuc-pham-chuc-nang/${product._id}`} className="product-link">
                  <div className="product-image">
                    <ProductImage 
                      image={product.image} 
                      name={product.name}
                      resolveImageSrc={resolveImageSrc}
                    />
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-meta">
                      <span className="product-brand">{product.brand}</span>
                      <span className="product-category">{product.category}</span>
                    </div>

                    <div className="product-price">
                      {product.price?.toLocaleString('vi-VN')}đ
                    </div>

                    {product.inStock && product.stock > 0 ? (
                      <div className="stock-status in-stock">
                        <i className="fi fi-rr-check"></i>
                        Còn hàng
                      </div>
                    ) : (
                      <div className="stock-status out-of-stock">
                        <i className="fi fi-rr-cross"></i>
                        Hết hàng
                      </div>
                    )}
                  </div>
                </Link>

                <div className="card-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock || product.stock === 0}
                  >
                    <i className="fi fi-rr-shopping-cart"></i>
                    {product.inStock && product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
