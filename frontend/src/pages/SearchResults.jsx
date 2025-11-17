import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard/ProductCard'
import './SearchResults.css'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'all',
    'Vitamin & Khoáng chất',
    'Sinh lý - Nội tiết tố',
    'Cải thiện tăng cường chức năng',
    'Hỗ trợ điều trị',
    'Hỗ trợ tiêu hóa',
    'Thần kinh não',
    'Hỗ trợ làm đẹp',
    'Sức khỏe tim mạch'
  ]

  // Tìm kiếm sản phẩm
  const filteredProducts = useMemo(() => {
    let results = products.filter(product => {
      const searchLower = query.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    })

    // Lọc theo category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory)
    }

    return results
  }, [query, selectedCategory])

  const handleSearch = (newQuery) => {
    navigate(`/tim-kiem?q=${encodeURIComponent(newQuery)}`)
  }

  const handleClearSearch = () => {
    navigate('/')
  }

  return (
    <div className='search-results-page'>
      {/* Search Bar */}
      <div className='search-header'>
        <div className='search-header-container'>
          <h1>Tìm Kiếm Sản Phẩm</h1>
          <form className='search-form' onSubmit={(e) => {
            e.preventDefault()
            const input = e.target.querySelector('input')
            if (input.value.trim()) {
              handleSearch(input.value)
            }
          }}>
            <input
              type='text'
              placeholder='Nhập tên sản phẩm, thuốc, bệnh...'
              defaultValue={query}
              className='search-input-large'
            />
            <button type='submit' className='search-btn-large'>
              <i className='fi fi-rr-search'></i>
              Tìm kiếm
            </button>
          </form>
          {query && (
            <p className='search-query-text'>
              Kết quả tìm kiếm cho: <strong>"{query}"</strong>
            </p>
          )}
        </div>
      </div>

      <div className='search-results-container'>
        {/* Sidebar Filters */}
        <aside className='search-sidebar'>
          <div className='filter-group'>
            <h3 className='filter-title'>Danh Mục Sản Phẩm</h3>
            <div className='category-filters'>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Tất cả danh mục' : category}
                  <span className='category-count'>
                    ({category === 'all'
                      ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).length
                      : products.filter(
                          p =>
                            p.category === category &&
                            p.name.toLowerCase().includes(query.toLowerCase())
                        ).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className='filter-group'>
            <h3 className='filter-title'>Lọc Nhanh</h3>
            <div className='quick-filters'>
              <button className='quick-filter-btn'>
                <i className='fi fi-rr-star'></i>
                Đánh giá cao
              </button>
              <button className='quick-filter-btn'>
                <i className='fi fi-rr-check'></i>
                Còn hàng
              </button>
              <button className='quick-filter-btn'>
                <i className='fi fi-rr-percent'></i>
                Đang khuyến mãi
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='search-results-main'>
          {/* Results Info */}
          <div className='results-info'>
            <div className='results-count'>
              <span className='count-number'>{filteredProducts.length}</span>
              <span className='count-text'>sản phẩm</span>
            </div>
            <div className='sort-options'>
              <label>Sắp xếp theo:</label>
              <select className='sort-select' defaultValue='relevant'>
                <option value='relevant'>Phù hợp nhất</option>
                <option value='price-low'>Giá: Thấp đến cao</option>
                <option value='price-high'>Giá: Cao đến thấp</option>
                <option value='rating'>Đánh giá cao nhất</option>
                <option value='newest'>Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {filteredProducts.length > 0 ? (
            <div className='products-grid'>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className='no-results'>
              <div className='no-results-icon'>
                <i className='fi fi-rr-search'></i>
              </div>
              <h2>Không tìm thấy sản phẩm</h2>
              <p>Không có sản phẩm nào phù hợp với tìm kiếm của bạn: <strong>"{query}"</strong></p>
              <div className='no-results-suggestions'>
                <h4>Gợi ý:</h4>
                <ul>
                  <li>✓ Kiểm tra cách viết của từ khóa</li>
                  <li>✓ Thử tìm kiếm với từ khóa khác</li>
                  <li>✓ Thử tìm kiếm tên hãng sản xuất</li>
                  <li>✓ Xem sản phẩm trong danh mục</li>
                </ul>
              </div>
              <button className='btn-browse' onClick={handleClearSearch}>
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default SearchResults
