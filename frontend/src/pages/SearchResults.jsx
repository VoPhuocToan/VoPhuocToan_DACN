import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import './SearchResults.css'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        console.log('Fetching products from:', `${apiUrl}/api/products?pageSize=1000`)
        const response = await fetch(`${apiUrl}/api/products?pageSize=1000`)
        const data = await response.json()
        
        console.log('API Response:', data)
        
        if (data.success && Array.isArray(data.data)) {
          // Normalize products for ProductCard
          const normalized = data.data.map(p => {
            const stock = Number(p.stock) || 0
            // Đảm bảo inStock sync với stock: nếu stock = 0 thì inStock = false
            const inStock = stock > 0 && (p.inStock !== false)
            return {
              id: p._id || p.id,
              name: p.name,
              brand: p.brand,
              price: p.price,
              originalPrice: p.originalPrice,
              image: p.image || (Array.isArray(p.images) ? p.images[0] : ''),
              category: p.category,
              description: p.description,
              ingredients: p.ingredients,
              usage: p.usage,
              rating: typeof p.rating === 'number' ? p.rating : 0,
              reviews: typeof p.numReviews === 'number' ? p.numReviews : 0,
              inStock: inStock,
              stock: stock
            }
          })
          console.log('Normalized products:', normalized.length)
          setProducts(normalized)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Tìm kiếm sản phẩm
  const filteredProducts = useMemo(() => {
    console.log('Search query:', query)
    console.log('Total products:', products.length)
    
    if (!query.trim()) {
      console.log('Empty query, returning all products')
      return products
    }
    
    let results = products.filter(product => {
      const searchLower = query.toLowerCase()
      const matches = (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      )
      return matches
    })

    console.log('Filtered results:', results.length)

    // Lọc theo category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory)
      console.log('After category filter:', results.length)
    }

    return results
  }, [query, selectedCategory, products])

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
          {loading ? (
            <div className='loading-state'>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
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
