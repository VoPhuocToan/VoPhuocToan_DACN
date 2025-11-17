import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className='home'>
      {/* Banner */}
      <section className='banner'>
        <div className='banner-content'>
          <h1>Thực phẩm chức năng chính hãng</h1>
          <p>Chăm sóc sức khỏe toàn diện với sản phẩm chất lượng cao</p>
          <Link to='/thuc-pham-chuc-nang' className='btn-primary'>
            Khám phá ngay
          </Link>
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

