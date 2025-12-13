import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './FlashSale.css'
import bannerImage from '../../assets/D_Banner_Flashsale_1216x120.png'

// Import all images from assets folder
const images = import.meta.glob('../../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const FlashSale = () => {
  const [products, setProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 11, seconds: 26 })
  const [activeTab, setActiveTab] = useState(0)

  // Helper to resolve image source
  const resolveImageSrc = (imgStr) => {
    if (!imgStr) return 'https://placehold.co/300x300?text=No+Image'
    
    if (imgStr.startsWith('http')) return imgStr
    
    if (imgStr.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      return `${apiUrl}${imgStr}`
    }
    
    // Look for the image in our imported images (local assets)
    const imagePath = `../../assets/${imgStr}`
    if (images[imagePath]) {
      return images[imagePath]
    }
    
    return imgStr
  }

  // Mock timeline data
  const timeline = [
    { time: '08:00 - 22:00', date: '12/12', status: 'Đang diễn ra' },
    { time: '08:00 - 22:00', date: '13/12', status: 'Sắp diễn ra' },
    { time: '10:00 - 13:00', date: '13/12', status: 'Sắp diễn ra' },
    { time: '18:00 - 21:00', date: '13/12', status: 'Sắp diễn ra' },
    { time: '08:00 - 22:00', date: '14/12', status: 'Sắp diễn ra' }
  ]

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch random products for flash sale
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/api/products?pageSize=6`)
        const data = await res.json()
        
        if (data.success) {
          // Add fake discount data and normalize image
          const flashSaleProducts = data.data.map(p => ({
            ...p,
            image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : 'https://placehold.co/300x300?text=No+Image'),
            discount: 22,
            salePrice: Math.round(p.price * 0.78 / 1000) * 1000 // 22% off
          }))
          setProducts(flashSaleProducts)
        }
      } catch (error) {
        console.error('Error fetching flash sale products:', error)
      }
    }
    fetchProducts()
  }, [])

  const formatTime = (num) => num.toString().padStart(2, '0')

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-banner">
        <img src={bannerImage} alt="Flash Sale Banner" />
      </div>

      <div className="flash-sale-timeline">
        {timeline.map((slot, index) => (
          <div 
            key={index} 
            className={`timeline-item ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            <div className="timeline-time">{slot.time}, {slot.date}</div>
            <div className="timeline-status">{slot.status}</div>
          </div>
        ))}
      </div>

      <div className="flash-sale-header">
        <div className="countdown-timer">
          <span>Kết thúc sau</span>
          <div className="timer-box">{formatTime(timeLeft.hours)}</div>
          <span className="timer-colon">:</span>
          <div className="timer-box">{formatTime(timeLeft.minutes)}</div>
          <span className="timer-colon">:</span>
          <div className="timer-box">{formatTime(timeLeft.seconds)}</div>
        </div>
      </div>

      <div className="flash-sale-products">
        {products.map(product => (
          <div key={product._id} className="flash-sale-card">
            <div className="discount-badge">-{product.discount}%</div>
            <Link to={`/thuc-pham-chuc-nang/${product._id}`} className="product-image-link">
              <img src={resolveImageSrc(product.image)} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/thuc-pham-chuc-nang/${product._id}`} className="product-name">
                {product.name}
              </Link>
              <div className="price-box">
                <span className="sale-price">{product.salePrice.toLocaleString('vi-VN')}đ</span>
                <span className="original-price-unit">/ Hộp</span>
              </div>
              <div className="original-price">{product.price.toLocaleString('vi-VN')}đ</div>
              
              <div className="deal-tag">
                <span className="fire-icon">🔥</span> Ưu đãi giá sốc
              </div>
              
              <Link to={`/thuc-pham-chuc-nang/${product._id}`} className="buy-button">
                Chọn mua
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlashSale
