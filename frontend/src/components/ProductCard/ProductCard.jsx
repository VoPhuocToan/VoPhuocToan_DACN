import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ProductCard.css'

// Import all images from assets folder
const images = import.meta.glob('../../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Check if product is in favorites
  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorite(false)
      return
    }

    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsFavorite(false)
          return
        }

        const productId = product.id || product._id
        const response = await fetch(`${apiUrl}/api/favorites/check/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(data.isFavorite)
        }
      } catch (error) {
        console.error('Error checking favorite:', error)
        setIsFavorite(false)
      }
    }

    checkFavorite()
  }, [product, isAuthenticated, apiUrl])

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      if (!isAuthenticated) return
      
      const checkFavorite = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) return

          const productId = product.id || product._id
          const response = await fetch(`${apiUrl}/api/favorites/check/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          const data = await response.json()
          if (data.success) {
            setIsFavorite(data.isFavorite)
          }
        } catch (error) {
          console.error('Error checking favorite:', error)
        }
      }

      checkFavorite()
    }

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate)
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
  }, [product, isAuthenticated, apiUrl])

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích')
      navigate('/dang-nhap')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const productId = product.id || product._id

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`${apiUrl}/api/favorites/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(false)
          // Dispatch event to update other components
          window.dispatchEvent(new Event('favoritesUpdated'))
        } else {
          alert(data.message || 'Không thể xóa khỏi danh sách yêu thích')
        }
      } else {
        // Add to favorites
        const response = await fetch(`${apiUrl}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(true)
          // Dispatch event to update other components
          window.dispatchEvent(new Event('favoritesUpdated'))
        } else {
          alert(data.message || 'Không thể thêm vào danh sách yêu thích')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Lỗi khi cập nhật danh sách yêu thích')
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/login')
      return
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const userId = localStorage.getItem('userId') || `guest_${Date.now()}`
    if (!localStorage.getItem('userId')) localStorage.setItem('userId', userId)

    const payload = {
      userId,
      quantity: 1,
      clientProductId: String(product.id),
      productData: {
        name: product.name,
        price: product.price,
        image: product.image
      }
    }

    try {
      const res = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        alert('Đã thêm sản phẩm vào giỏ hàng')
        // Optionally update cart count via event or state
      } else {
        alert(data.message || 'Không thể thêm vào giỏ hàng')
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      alert('Lỗi khi thêm vào giỏ hàng')
    }
  }

  const resolveImageSrc = (img) => {
    if (!img) return ''
    const imgStr = String(img)
    
    // If it's already a full URL, return it
    if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
      return imgStr
    }
    
    // If it's a server upload path (starts with /uploads), prepend API URL
    if (imgStr.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      return `${apiUrl}${imgStr}`
    }
    
    // Look for the image in our imported images (local assets)
    const imagePath = `../../assets/${imgStr}`
    if (images[imagePath]) {
      return images[imagePath]
    }
    
    // If not found, return a placeholder or the original string
    console.warn(`Image not found: ${imgStr}`)
    return imgStr
  }

  return (
    <div className='product-card'>
      <Link to={`/thuc-pham-chuc-nang/${product.id}`} className='product-link'>
        {discount > 0 && (
          <div className='product-badge'>-{discount}%</div>
        )}
        <button 
          className={`favorite-icon-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <i className={`fi ${isFavorite ? 'fi-sr-heart' : 'fi-rr-heart'}`}></i>
        </button>
        <div className='product-image-container'>
          <img src={resolveImageSrc(product.image)} alt={product.name} className='product-image' />
        </div>
        <div className='product-info'>
          <div className='product-brand'>{product.brand}</div>
          <h3 className='product-name'>{product.name}</h3>
          <div className='product-rating'>
            <span className='stars'>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className='rating-value'>({product.rating})</span>
            <span className='reviews'>{product.reviews} đánh giá</span>
          </div>
          <div className='product-price'>
            <span className='current-price'>{product.price.toLocaleString('vi-VN')}đ</span>
            {product.originalPrice && (
              <span className='original-price'>{product.originalPrice.toLocaleString('vi-VN')}đ</span>
            )}
          </div>
          {!product.inStock && (
            <div className='out-of-stock'>Hết hàng</div>
          )}
        </div>
      </Link>
      <div className='product-actions'>
        <button 
          className='btn-add-small' 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          title={product.inStock ? 'Thêm vào giỏ hàng' : 'Sản phẩm đã hết hàng'}
        >
          <i className='fi fi-rr-shopping-cart'></i>
          {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

