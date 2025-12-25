import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './admin.css'

const AdminPromotionForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: 0,
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
    applicableProducts: []
  })

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState(null)

  // Helper to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    // Adjust for timezone offset to display local time correctly in input
    const offset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - offset)
    return localDate.toISOString().slice(0, 16)
  }

  useEffect(() => {
    fetchProducts()
    if (isEditMode) {
      fetchPromotion()
    }
  }, [id])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/products?pageSize=1000`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      } else {
        console.error('Failed to load products:', data.message)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchPromotion = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/promotions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        const promo = data.data
        setFormData({
          ...promo,
          startDate: formatDateForInput(promo.startDate),
          endDate: formatDateForInput(promo.endDate),
          maxDiscount: promo.maxDiscount || '',
          usageLimit: promo.usageLimit || '',
          applicableProducts: promo.applicableProducts || []
        })
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Không thể tải thông tin khuyến mãi')
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : []
      const isSelected = currentProducts.includes(productId)
      
      if (isSelected) {
        return {
          ...prev,
          applicableProducts: currentProducts.filter(id => id !== productId)
        }
      } else {
        return {
          ...prev,
          applicableProducts: [...currentProducts, productId]
        }
      }
    })
  }

  const handleSelectAll = () => {
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredIds = filteredProducts.map(p => p._id)
    
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : []
      const newSelection = [...new Set([...currentProducts, ...filteredIds])]
      return { ...prev, applicableProducts: newSelection }
    })
  }

  const handleDeselectAll = () => {
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredIds = filteredProducts.map(p => p._id)
    
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : []
      const newSelection = currentProducts.filter(id => !filteredIds.includes(id))
      return { ...prev, applicableProducts: newSelection }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      }

      const url = isEditMode 
        ? `${apiUrl}/api/promotions/${id}`
        : `${apiUrl}/api/promotions`
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        navigate('/admin/promotions')
      } else {
        setError(data.message || 'Có lỗi xảy ra')
      }
    } catch (err) {
      setError('Lỗi kết nối server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>{isEditMode ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}</h1>
        <button className="btn-back" onClick={() => navigate('/admin/promotions')}>
          <i className="fi fi-rr-arrow-left"></i> Quay lại
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Mã khuyến mãi *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="VD: SUMMER2025 hoặc FLASH_SALE_1212"
              style={{ textTransform: 'uppercase' }}
            />
            <small style={{ color: '#666', fontSize: '0.85em' }}>
              Để tạo Flash Sale, hãy bắt đầu mã bằng "FLASH_" (VD: FLASH_1212)
            </small>
          </div>
          
          <div className="form-group">
            <label>Trạng thái</label>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                id="isActive"
              />
              <label htmlFor="isActive">Đang hoạt động</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Mô tả chi tiết về chương trình khuyến mãi"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Loại giảm giá</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (VNĐ)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Giá trị giảm *</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Đơn hàng tối thiểu</label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Giảm tối đa (cho %)</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              min="0"
              disabled={formData.discountType === 'fixed'}
              placeholder={formData.discountType === 'fixed' ? 'Không áp dụng' : ''}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Thời gian bắt đầu *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Thời gian kết thúc *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Giới hạn số lần sử dụng (để trống nếu không giới hạn)</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
            <label>Áp dụng cho sản phẩm</label>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            
            <div style={{ marginBottom: '8px', display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={handleSelectAll}
                className="btn small"
                style={{ backgroundColor: '#e2e8f0', color: '#334155' }}
              >
                Chọn tất cả (theo lọc)
              </button>
              <button 
                type="button" 
                onClick={handleDeselectAll}
                className="btn small"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
              >
                Bỏ chọn tất cả (theo lọc)
              </button>
            </div>

            <div className="product-selection-list">
             {loadingProducts ? (
                <div style={{padding: '10px', textAlign: 'center', color: '#666'}}>Đang tải sản phẩm...</div>
             ) : products.length === 0 ? (
                <div style={{padding: '10px', textAlign: 'center', color: '#666'}}>Không tìm thấy sản phẩm nào.</div>
             ) : (
                products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                   <div key={product._id} className="product-checkbox-item">
                      <input 
                         type="checkbox"
                         id={`prod-${product._id}`}
                         checked={Array.isArray(formData.applicableProducts) && formData.applicableProducts.includes(product._id)}
                         onChange={() => handleProductToggle(product._id)}
                      />
                      <label htmlFor={`prod-${product._id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: '100%', margin: 0 }}>
                         {product.images && product.images[0] && (
                           <img src={product.images[0]} alt="" className="mini-thumb" />
                         )}
                         <span>{product.name} - {product.price?.toLocaleString()}đ</span>
                      </label>
                   </div>
                ))
             )}
          </div>
          <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
            {formData.applicableProducts?.length > 0 
              ? `Đã chọn ${formData.applicableProducts.length} sản phẩm` 
              : 'Để trống nếu áp dụng cho tất cả sản phẩm'}
          </small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminPromotionForm
