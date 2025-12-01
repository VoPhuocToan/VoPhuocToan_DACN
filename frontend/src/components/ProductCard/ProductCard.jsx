import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ProductCard.css'

// Import all images from assets folder
const images = import.meta.glob('../../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

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
        <button className='btn-add-small' onClick={handleAddToCart}>Thêm</button>
      </div>
    </div>
  )
}

export default ProductCard

