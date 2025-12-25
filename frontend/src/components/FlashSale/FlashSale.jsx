import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './FlashSale.css'
import bannerImage from '../../assets/D_Banner_Flashsale_1216x120.png'

// Import all images from assets folder
const images = import.meta.glob('../../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const FlashSale = () => {
  const [products, setProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [activeTab, setActiveTab] = useState(0)
  const [flashSales, setFlashSales] = useState([])
  const [loading, setLoading] = useState(true)

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

  const formatTime = (num) => num.toString().padStart(2, '0')

  // Fetch Flash Sales
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/api/promotions?pageSize=100`)
        const data = await res.json()

        if (data.success) {
          const now = new Date()
          // Filter for active and upcoming flash sales
          const validSales = data.data.filter(p => 
            p.isActive && 
            new Date(p.endDate) > now && 
            (p.code.toUpperCase().includes('FLASH') || p.description.toLowerCase().includes('flash sale'))
          ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

          setFlashSales(validSales)
          
          // Find active sale index
          const activeIndex = validSales.findIndex(p => {
            const start = new Date(p.startDate)
            const end = new Date(p.endDate)
            return now >= start && now <= end
          })

          if (activeIndex !== -1) {
            setActiveTab(activeIndex)
          } else {
            setActiveTab(0)
          }
        }
      } catch (error) {
        console.error('Error fetching flash sales:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFlashSales()
  }, [])

  // Countdown timer logic
  useEffect(() => {
    if (flashSales.length === 0) return

    const calculateTimeLeft = () => {
      const activeSale = flashSales[activeTab]
      if (!activeSale) return

      const now = new Date()
      const end = new Date(activeSale.endDate)
      
      let diff = end - now
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [activeTab, flashSales])

  // Fetch products for the active flash sale
  useEffect(() => {
    const fetchProducts = async () => {
      if (flashSales.length === 0) return

      const activeSale = flashSales[activeTab]
      if (!activeSale) return

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        let flashSaleProducts = []

        // Check if the promotion has specific products selected
        if (activeSale.applicableProducts && activeSale.applicableProducts.length > 0) {
           // Fetch products by IDs
           const ids = activeSale.applicableProducts.join(',')
           const res = await fetch(`${apiUrl}/api/products?ids=${ids}&pageSize=100`)
           const data = await res.json()
           
           if (data.success) {
             flashSaleProducts = data.data
           }
        } else {
           // Fallback: Fetch random products
           const res = await fetch(`${apiUrl}/api/products?pageSize=6`)
           const data = await res.json()
           if (data.success) {
             flashSaleProducts = data.data
           }
        }
        
        if (flashSaleProducts.length > 0) {
          const discountValue = activeSale.discountValue || 0
          
          const formattedProducts = flashSaleProducts.map(p => ({
            ...p,
            image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : 'https://placehold.co/300x300?text=No+Image'),
            discount: discountValue,
            salePrice: Math.round(p.price * (100 - discountValue) / 100 / 1000) * 1000 
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error('Error fetching flash sale products:', error)
      }
    }
    fetchProducts()
  }, [activeTab, flashSales])

  if (loading) return null
  if (flashSales.length === 0) return null

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-banner">
        <img src={bannerImage} alt="Flash Sale Banner" />
      </div>

      <div className="flash-sale-timeline">
        {flashSales.map((sale, index) => {
            const start = new Date(sale.startDate)
            const end = new Date(sale.endDate)
            const now = new Date()
            
            let status = 'Sắp diễn ra'
            if (now >= start && now <= end) status = 'Đang diễn ra'
            
            const timeStr = `${formatTime(start.getHours())}:${formatTime(start.getMinutes())} - ${formatTime(end.getHours())}:${formatTime(end.getMinutes())}`
            const dateStr = `${formatTime(start.getDate())}/${formatTime(start.getMonth() + 1)}`

            return (
              <div 
                key={sale._id} 
                className={`timeline-item ${index === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <div className="timeline-time">{timeStr}</div>
                <div className="timeline-date">{dateStr}</div>
                <div className="timeline-status">{status}</div>
              </div>
            )
        })}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlashSale