import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/Products.css'

const ProductList = () => {
  const { token, API_URL, fetchWithAuth } = useStore()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Filters & Search
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  
  // Detail modal
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.svg'
    if (imagePath.startsWith('http')) return imagePath
    
    // Remove /api from the end of API_URL if present
    const baseUrl = API_URL.replace(/\/api$/, '')
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    
    if (cleanPath.startsWith('uploads/')) {
      return `${baseUrl}/${cleanPath}`
    }
    return `${baseUrl}/uploads/${cleanPath}`
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/products?pageSize=1000`)
      const data = await res.json()
      if (data.success) {
        setProducts(data.data)
        setFilteredProducts(data.data)
      } else {
        setError(data.message || 'Lỗi khi lấy sản phẩm')
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`)
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let result = [...products]
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      )
    }
    
    // Category filter
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter)
    }
    
    // Stock filter
    if (stockFilter === 'inStock') {
      result = result.filter(p => p.stock > 10)
    } else if (stockFilter === 'lowStock') {
      result = result.filter(p => p.stock > 0 && p.stock <= 10)
    } else if (stockFilter === 'outOfStock') {
      result = result.filter(p => p.stock === 0)
    }
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'stock':
          comparison = a.stock - b.stock
          break
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0)
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, search, categoryFilter, stockFilter, sortBy, sortOrder])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      })
      
      if (!res) return;

      const data = await res.json()
      if (data.success) {
        fetchProducts()
        alert('Xóa sản phẩm thành công!')
      } else {
        alert(data.message || 'Xóa thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi xóa sản phẩm')
    }
  }

  const handleViewDetail = (product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: 'out-of-stock', text: 'Hết hàng', icon: '🔴' }
    if (stock <= 10) return { class: 'low-stock', text: 'Sắp hết', icon: '🟡' }
    return { class: 'in-stock', text: 'Còn hàng', icon: '🟢' }
  }

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + ' ₫'
  }

  // Stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  return (
    <div className='products-page'>
      {/* Header */}
      <div className='page-header'>
        <div className='header-left'>
          <h1>📦 Quản lý sản phẩm</h1>
          <p className='header-subtitle'>Quản lý tất cả sản phẩm trong cửa hàng</p>
        </div>
        <Link to='/products/new' className='btn btn-primary btn-add'>
          ➕ Thêm sản phẩm mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className='stats-grid'>
        <div className='stat-card total'>
          <div className='stat-icon'>📊</div>
          <div className='stat-info'>
            <span className='stat-number'>{stats.total}</span>
            <span className='stat-label'>Tổng sản phẩm</span>
          </div>
        </div>
        <div className='stat-card success'>
          <div className='stat-icon'>🟢</div>
          <div className='stat-info'>
            <span className='stat-number'>{stats.inStock}</span>
            <span className='stat-label'>Còn hàng</span>
          </div>
        </div>
        <div className='stat-card warning'>
          <div className='stat-icon'>🟡</div>
          <div className='stat-info'>
            <span className='stat-number'>{stats.lowStock}</span>
            <span className='stat-label'>Sắp hết</span>
          </div>
        </div>
        <div className='stat-card danger'>
          <div className='stat-icon'>🔴</div>
          <div className='stat-info'>
            <span className='stat-number'>{stats.outOfStock}</span>
            <span className='stat-label'>Hết hàng</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='filters-section'>
        <div className='search-box'>
          <span className='search-icon'>🔍</span>
          <input
            type='text'
            placeholder='Tìm kiếm theo tên, thương hiệu...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className='clear-search' onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className='filter-controls'>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='filter-select'
          >
            <option value=''>📁 Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className='filter-select'
          >
            <option value=''>📦 Tất cả tồn kho</option>
            <option value='inStock'>🟢 Còn hàng ({'>'}10)</option>
            <option value='lowStock'>🟡 Sắp hết (1-10)</option>
            <option value='outOfStock'>🔴 Hết hàng (0)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='filter-select'
          >
            <option value='name'>Sắp xếp: Tên</option>
            <option value='price'>Sắp xếp: Giá</option>
            <option value='stock'>Sắp xếp: Tồn kho</option>
            <option value='rating'>Sắp xếp: Đánh giá</option>
          </select>

          <button
            className='sort-order-btn'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className='view-toggle'>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title='Xem dạng bảng'
            >
              ☰
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title='Xem dạng lưới'
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className='results-info'>
        <span>Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className='error-container'>
          <p className='error'>❌ {error}</p>
          <button onClick={fetchProducts} className='btn btn-primary'>Thử lại</button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className='table-container'>
          <table className='products-table'>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Đánh giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan='7' className='empty-row'>
                    <div className='empty-state'>
                      <span className='empty-icon'>📭</span>
                      <p>Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(prod => {
                  const stockStatus = getStockStatus(prod.stock)
                  return (
                    <tr key={prod._id}>
                      <td>
                        <div className='product-cell'>
                          <img
                            src={getImageUrl(prod.images?.[0] || prod.image)}
                            alt={prod.name}
                            className='product-thumb'
                            onError={(e) => e.target.src = '/placeholder.svg'}
                          />
                          <div className='product-info'>
                            <span className='product-name'>{prod.name}</span>
                            <span className='product-id'>ID: {prod._id.slice(-8)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className='brand-badge'>{prod.brand || 'N/A'}</span>
                      </td>
                      <td>
                        <span className='category-tag'>{prod.category}</span>
                      </td>
                      <td>
                        <div className='price-cell'>
                          <span className='current-price'>{formatPrice(prod.price)}</span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className='original-price'>{formatPrice(prod.originalPrice)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={`stock-badge ${stockStatus.class}`}>
                          <span>{stockStatus.icon}</span>
                          <span>{prod.stock}</span>
                        </div>
                      </td>
                      <td>
                        <div className='rating-cell'>
                          <span className='rating-star'>⭐</span>
                          <span>{prod.rating?.toFixed(1) || '0.0'}</span>
                          <span className='review-count'>({prod.numReviews || 0})</span>
                        </div>
                      </td>
                      <td>
                        <div className='action-buttons'>
                          <button
                            className='btn btn-sm btn-info'
                            onClick={() => handleViewDetail(prod)}
                            title='Xem chi tiết'
                          >
                            👁️
                          </button>
                          <Link
                            to={`/products/${prod._id}`}
                            className='btn btn-sm btn-edit'
                            title='Chỉnh sửa'
                          >
                            ✏️
                          </Link>
                          <button
                            className='btn btn-sm btn-danger'
                            onClick={() => handleDelete(prod._id)}
                            title='Xóa'
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className='products-grid'>
          {paginatedProducts.length === 0 ? (
            <div className='empty-state'>
              <span className='empty-icon'>📭</span>
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            paginatedProducts.map(prod => {
              const stockStatus = getStockStatus(prod.stock)
              return (
                <div key={prod._id} className='product-card'>
                  <div className='card-image'>
                    <img
                      src={getImageUrl(prod.images?.[0] || prod.image)}
                      alt={prod.name}
                      onError={(e) => e.target.src = '/placeholder.svg'}
                    />
                    <div className={`stock-badge ${stockStatus.class}`}>
                      {stockStatus.icon} {stockStatus.text}
                    </div>
                  </div>
                  <div className='card-content'>
                    <h3 className='card-title'>{prod.name}</h3>
                    <p className='card-brand'>{prod.brand}</p>
                    <span className='card-category'>{prod.category}</span>
                    <div className='card-price'>
                      <span className='current'>{formatPrice(prod.price)}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className='original'>{formatPrice(prod.originalPrice)}</span>
                      )}
                    </div>
                    <div className='card-meta'>
                      <span className='stock'>📦 {prod.stock}</span>
                      <span className='rating'>⭐ {prod.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  <div className='card-actions'>
                    <button
                      className='btn btn-sm btn-info'
                      onClick={() => handleViewDetail(prod)}
                    >
                      👁️ Chi tiết
                    </button>
                    <Link to={`/products/${prod._id}`} className='btn btn-sm btn-edit'>
                      ✏️ Sửa
                    </Link>
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDelete(prod._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='pagination'>
          <button
            className='btn btn-sm'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            ⟨⟨
          </button>
          <button
            className='btn btn-sm'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            ← Trước
          </button>
          
          <div className='page-numbers'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            className='btn btn-sm'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Sau →
          </button>
          <button
            className='btn btn-sm'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            ⟩⟩
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className='modal-overlay' onClick={() => setShowDetailModal(false)}>
          <div className='modal-content product-detail-modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>📦 Chi tiết sản phẩm</h2>
              <button className='modal-close' onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className='modal-body'>
              <div className='detail-grid'>
                <div className='detail-images'>
                  <img
                    src={selectedProduct.images?.[0] || selectedProduct.image || '/placeholder.jpg'}
                    alt={selectedProduct.name}
                    className='main-image'
                  />
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className='image-thumbnails'>
                      {selectedProduct.images.slice(0, 4).map((img, idx) => (
                        <img key={idx} src={img} alt={`${selectedProduct.name} ${idx + 1}`} />
                      ))}
                    </div>
                  )}
                </div>
                <div className='detail-info'>
                  <h3>{selectedProduct.name}</h3>
                  <p className='detail-brand'>Thương hiệu: <strong>{selectedProduct.brand}</strong></p>
                  <p className='detail-category'>Danh mục: <span className='category-tag'>{selectedProduct.category}</span></p>
                  
                  <div className='detail-price'>
                    <span className='current-price'>{formatPrice(selectedProduct.price)}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <>
                        <span className='original-price'>{formatPrice(selectedProduct.originalPrice)}</span>
                        <span className='discount-badge'>
                          -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className='detail-stats'>
                    <div className='stat-item'>
                      <span className='stat-label'>Tồn kho</span>
                      <span className={`stock-badge ${getStockStatus(selectedProduct.stock).class}`}>
                        {getStockStatus(selectedProduct.stock).icon} {selectedProduct.stock}
                      </span>
                    </div>
                    <div className='stat-item'>
                      <span className='stat-label'>Đánh giá</span>
                      <span>⭐ {selectedProduct.rating?.toFixed(1) || '0.0'} ({selectedProduct.numReviews || 0})</span>
                    </div>
                  </div>

                  <div className='detail-section'>
                    <h4>Mô tả</h4>
                    <p>{selectedProduct.description || 'Chưa có mô tả'}</p>
                  </div>

                  {selectedProduct.ingredients && (
                    <div className='detail-section'>
                      <h4>Thành phần</h4>
                      <p>{selectedProduct.ingredients}</p>
                    </div>
                  )}

                  {selectedProduct.usage && (
                    <div className='detail-section'>
                      <h4>Cách dùng</h4>
                      <p>{selectedProduct.usage}</p>
                    </div>
                  )}

                  {selectedProduct.note && (
                    <div className='detail-section'>
                      <h4>Lưu ý</h4>
                      <p>{selectedProduct.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-secondary' onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
              <Link to={`/products/${selectedProduct._id}`} className='btn btn-primary'>
                ✏️ Chỉnh sửa sản phẩm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList
