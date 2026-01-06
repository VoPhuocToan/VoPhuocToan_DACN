import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import '../styles/ProductPerformance.css'

const ProductPerformance = () => {
  const { token, API_URL, fetchWithAuth } = useStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('best') // 'best' or 'slow'

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchWithAuth(`${API_URL}/products/stats?type=${activeTab}`)
      if (!res) return

      const data = await res.json()
      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.message || 'Lỗi khi tải dữ liệu thống kê')
      }
    } catch (err) {
      console.error(err)
      setError('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStats()
    }
  }, [activeTab, token])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

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

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: 'out-of-stock', text: 'Hết hàng', icon: '🔴' }
    if (stock <= 10) return { class: 'low-stock', text: 'Sắp hết', icon: '🟡' }
    return { class: 'in-stock', text: 'Còn hàng', icon: '🟢' }
  }

  return (
    <div className="product-performance-page">
      <div className="page-header">
        <h1>📊 Thống kê hiệu quả sản phẩm</h1>
      </div>

      <div className="performance-tabs">
        <button 
          className={`tab-btn ${activeTab === 'best' ? 'active' : ''}`}
          onClick={() => setActiveTab('best')}
        >
          🏆 Sản phẩm bán chạy
        </button>
        <button 
          className={`tab-btn ${activeTab === 'slow' ? 'active' : ''}`}
          onClick={() => setActiveTab('slow')}
        >
          🐌 Sản phẩm bán chậm
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error">❌ {error}</p>
          <button onClick={fetchStats} className="btn btn-primary">Thử lại</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>#</th>
                <th>Sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th className="highlight-th">Đã bán</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">Không có dữ liệu</td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <tr key={product._id}>
                      <td className="rank-cell">
                          {index < 3 && activeTab === 'best' ? (
                              <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                          ) : (
                              index + 1
                          )}
                      </td>
                      <td>
                        <div className="product-cell">
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className="product-thumb"
                            onError={(e) => e.target.src = '/placeholder.svg'}
                          />
                          <div className="product-info">
                            <span className="product-name" title={product.name}>{product.name}</span>
                            <span className="product-id">ID: {product._id.slice(-8)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="brand-badge">{product.brand || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="category-tag">{product.category}</span>
                      </td>
                      <td>
                        <div className="price-cell">
                          <span className="current-price">{formatPrice(product.price)}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`stock-badge ${stockStatus.class}`}>
                          <span>{stockStatus.icon}</span>
                          <span>{product.stock}</span>
                        </div>
                      </td>
                      <td className="sold-cell">
                        {product.totalSold}
                      </td>
                      <td className="revenue-cell">
                        {formatPrice(product.revenue)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductPerformance
