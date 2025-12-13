import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import FlashSale from '../components/FlashSale/FlashSale'
import './Home.css'

// Import background images
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const getImage = (filename) => {
  const path = `../assets/${filename}`
  return images[path] || ''
}

const Home = () => {
  const [currentMainSlide, setCurrentMainSlide] = useState(0)
  const [currentSmallSlide, setCurrentSmallSlide] = useState(0)
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Main slider images
  const mainSlides = [
    { image: getImage('BG_lớn_1.png'), title: 'Thực phẩm chức năng chính hãng', subtitle: 'Chăm sóc sức khỏe toàn diện với sản phẩm chất lượng cao' },
    { image: getImage('BG_lớn_2.png'), title: 'Sức khỏe là vàng', subtitle: 'Đầu tư cho sức khỏe hôm nay, hạnh phúc ngày mai' }
  ]

  // Small slider images
  const smallSlides = [
    { image: getImage('bg_nhỏ_1.jpg'), link: '/thuc-pham-chuc-nang/69341ec10764a4c44c1015ea' },
    { image: getImage('bg_nhỏ_3.png'), link: '/thuc-pham-chuc-nang/69341ec10764a4c44c1015ed' }
  ]

  // Auto slide for main banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainSlide((prev) => (prev + 1) % mainSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto slide for small banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSmallSlide((prev) => (prev + 1) % smallSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Fetch best selling products
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/api/products?pageSize=100`)
        const data = await res.json()
        
        const list = Array.isArray(data?.data) ? data.data : 
                     Array.isArray(data?.products) ? data.products : 
                     Array.isArray(data) ? data : []
        
        // Normalize and sort by reviews (best selling = most reviewed)
        const normalized = list.map(p => {
          const stock = Number(p.stock) || 0
          // Đảm bảo inStock sync với stock: nếu stock = 0 thì inStock = false
          const inStock = stock > 0 && (p.inStock !== false)
          return {
            id: p._id || p.id,
            _id: p._id || p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image || (Array.isArray(p.images) ? p.images[0] : ''),
            category: p.category,
            rating: typeof p.rating === 'number' ? p.rating : 0,
            reviews: typeof p.numReviews === 'number' ? p.numReviews : 0,
            inStock: inStock,
            stock: stock
          }
        })
        
        // Sort by number of reviews (descending) and take top 5
        const sorted = normalized.sort((a, b) => b.reviews - a.reviews).slice(0, 5)
        setBestSellingProducts(sorted)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching best selling products:', error)
        setLoading(false)
      }
    }
    
    fetchBestSellingProducts()
  }, [])

  const nextMainSlide = () => {
    setCurrentMainSlide((prev) => (prev + 1) % mainSlides.length)
  }

  const prevMainSlide = () => {
    setCurrentMainSlide((prev) => (prev - 1 + mainSlides.length) % mainSlides.length)
  }

  return (
    <div className='home'>
      {/* Main Banner Slider */}
      <section className='main-banner-slider'>
        <div className='slider-container'>
          {mainSlides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentMainSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
            </div>
          ))}
          
          {/* Navigation buttons */}
          <button className='slider-btn prev' onClick={prevMainSlide}>
            <span>‹</span>
          </button>
          <button className='slider-btn next' onClick={nextMainSlide}>
            <span>›</span>
          </button>

          {/* Dots indicator */}
          <div className='slider-dots'>
            {mainSlides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentMainSlide ? 'active' : ''}`}
                onClick={() => setCurrentMainSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Small Banner Slider */}
      <section className='small-banner-section'>
        <div className='container'>
          <div className='small-slider-container'>
            {smallSlides.map((slide, index) => (
              <div
                key={index}
                className={`small-slide ${index === currentSmallSlide ? 'active' : ''}`}
              >
                {slide.link ? (
                  <Link to={slide.link}>
                    <img src={slide.image} alt={`Khuyến mãi ${index + 1}`} />
                  </Link>
                ) : (
                  <img src={slide.image} alt={`Khuyến mãi ${index + 1}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Best Selling Products */}
      <section className='best-selling-section'>
        <div className='container'>
          <h2 className='section-title'>Sản phẩm bán chạy</h2>
          {loading ? (
            <div className='loading-products'>Đang tải...</div>
          ) : (
            <div className='best-selling-grid'>
              {bestSellingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className='categories-section'>
        <div className='container'>
          <h2 className='section-title'>Danh mục sản phẩm</h2>
          <div className='categories-grid'>
            <Link to='/thuc-pham-chuc-nang?category=Vitamin & Khoáng chất' className='category-card'>
              <div className='category-icon'>💊</div>
              <h3>Vitamin & Khoáng chất</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Sinh lý - Nội tiết tố' className='category-card'>
              <div className='category-icon'>⚕️</div>
              <h3>Sinh lý - Nội tiết tố</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Cải thiện tăng cường chức năng' className='category-card'>
              <div className='category-icon'>⚡</div>
              <h3>Cải thiện tăng cường chức năng</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Hỗ trợ điều trị' className='category-card'>
              <div className='category-icon'>🏥</div>
              <h3>Hỗ trợ điều trị</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Hỗ trợ tiêu hóa' className='category-card'>
              <div className='category-icon'>🌿</div>
              <h3>Hỗ trợ tiêu hóa</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Thần kinh não' className='category-card'>
              <div className='category-icon'>🧠</div>
              <h3>Thần kinh não</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Hỗ trợ làm đẹp' className='category-card'>
              <div className='category-icon'>✨</div>
              <h3>Hỗ trợ làm đẹp</h3>
            </Link>
            <Link to='/thuc-pham-chuc-nang?category=Sức khỏe tim mạch' className='category-card'>
              <div className='category-icon'>❤️</div>
              <h3>Sức khỏe tim mạch</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

