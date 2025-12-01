import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

  // Main slider images
  const mainSlides = [
    { image: getImage('BG_lớn_1.png'), title: 'Thực phẩm chức năng chính hãng', subtitle: 'Chăm sóc sức khỏe toàn diện với sản phẩm chất lượng cao' },
    { image: getImage('BG_lớn_2.png'), title: 'Sức khỏe là vàng', subtitle: 'Đầu tư cho sức khỏe hôm nay, hạnh phúc ngày mai' }
  ]

  // Small slider images
  const smallSlides = [
    getImage('bg_nhỏ_1.jpg'),
    getImage('bg_nhỏ_2.jpg'),
    getImage('bg_nhỏ_3.png')
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
                <img src={slide} alt={`Khuyến mãi ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='features'>
        <div className='container'>
          <div className='feature-grid'>
            <div className='feature-item'>
              <div className='feature-icon'>✓</div>
              <h3>Chính hãng 100%</h3>
              <p>Cam kết sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng</p>
            </div>
            <div className='feature-item'>
              <div className='feature-icon'>🚚</div>
              <h3>Giao hàng nhanh</h3>
              <p>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
            </div>
            <div className='feature-item'>
              <div className='feature-icon'>💰</div>
              <h3>Giá tốt nhất</h3>
              <p>Giá cả cạnh tranh với nhiều chương trình khuyến mãi</p>
            </div>
            <div className='feature-item'>
              <div className='feature-icon'>💬</div>
              <h3>Tư vấn miễn phí</h3>
              <p>Đội ngũ dược sĩ tư vấn chuyên nghiệp 24/7</p>
            </div>
          </div>
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

