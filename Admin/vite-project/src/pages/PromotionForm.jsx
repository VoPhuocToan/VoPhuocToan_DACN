import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/PromotionForm.css';

const PromotionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token, fetchWithAuth } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
    applicableProducts: []
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    if (isEditMode) {
      fetchPromotion();
    }
  }, [id]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      // Use fetch directly or fetchWithAuth. Products are usually public or protected.
      // Assuming public for now or fetchWithAuth handles it.
      const response = await fetch(`${API_URL}/products?pageSize=1000`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error('Failed to load products:', data.message);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}/promotions/${id}`);
      if (!response) return;
      
      const data = await response.json();
      const promotion = data.data;
      
      // Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        // Adjust for timezone offset to show local time correctly
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
      };

      setFormData({
        code: promotion.code,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        minOrderValue: promotion.minOrderValue || '',
        maxDiscount: promotion.maxDiscount || '',
        usageLimit: promotion.usageLimit || '',
        startDate: formatDateForInput(promotion.startDate),
        endDate: formatDateForInput(promotion.endDate),
        isActive: promotion.isActive,
        applicableProducts: promotion.applicableProducts || []
      });
    } catch (error) {
      console.error('Error fetching promotion:', error);
      alert('Không thể tải thông tin khuyến mãi');
      navigate('/admin/promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : [];
      const isSelected = currentProducts.includes(productId);
      
      if (isSelected) {
        return {
          ...prev,
          applicableProducts: currentProducts.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          applicableProducts: [...currentProducts, productId]
        };
      }
    });
  };

  const handleSelectAll = () => {
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredIds = filteredProducts.map(p => p._id);
    
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : [];
      const newSelection = [...new Set([...currentProducts, ...filteredIds])];
      return { ...prev, applicableProducts: newSelection };
    });
  };

  const handleDeselectAll = () => {
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredIds = filteredProducts.map(p => p._id);
    
    setFormData(prev => {
      const currentProducts = Array.isArray(prev.applicableProducts) ? prev.applicableProducts : [];
      const newSelection = currentProducts.filter(id => !filteredIds.includes(id));
      return { ...prev, applicableProducts: newSelection };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã khuyến mãi';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Mã khuyến mãi phải có ít nhất 3 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Vui lòng nhập giá trị giảm giá';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Giảm giá theo % không được vượt quá 100%';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: Number(formData.maxDiscount) || 0,
        usageLimit: Number(formData.usageLimit) || 0
      };

      let response;
      if (isEditMode) {
        response = await fetchWithAuth(`${API_URL}/promotions/${id}`, {
          method: 'PUT',
          body: JSON.stringify(submitData)
        });
      } else {
        response = await fetchWithAuth(`${API_URL}/promotions`, {
          method: 'POST',
          body: JSON.stringify(submitData)
        });
      }

      if (!response) return;

      if (response.ok) {
        alert(isEditMode ? 'Cập nhật khuyến mãi thành công!' : 'Tạo khuyến mãi thành công!');
        navigate('/promotions');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert(error.message || 'Không thể lưu khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="promotion-form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</h1>
        <button className="btn-back" onClick={() => navigate('/promotions')}>
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="promotion-form">
        <div className="form-grid">
          {/* Code */}
          <div className="form-group">
            <label>
              Mã khuyến mãi <span className="required">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: SUMMER2024 hoặc FLASH_1212"
              className={errors.code ? 'error' : ''}
              disabled={isEditMode}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
            <small>Mã sẽ tự động chuyển thành chữ in hoa. Để tạo Flash Sale, hãy bắt đầu mã bằng "FLASH_"</small>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>
              Mô tả <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về chương trình khuyến mãi"
              rows="3"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Discount Type */}
          <div className="form-group">
            <label>
              Loại giảm giá <span className="required">*</span>
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (đ)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="form-group">
            <label>
              Giá trị giảm <span className="required">*</span>
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
              min="0"
              step={formData.discountType === 'percentage' ? '1' : '1000'}
              className={errors.discountValue ? 'error' : ''}
            />
            {errors.discountValue && <span className="error-message">{errors.discountValue}</span>}
            <small>
              {formData.discountType === 'percentage' 
                ? 'Nhập % giảm (0-100)' 
                : 'Nhập số tiền giảm (VNĐ)'}
            </small>
          </div>

          {/* Min Order Value */}
          <div className="form-group">
            <label>Giá trị đơn hàng tối thiểu</label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1000"
            />
            <small>Để trống hoặc 0 nếu không yêu cầu</small>
          </div>

          {/* Max Discount */}
          {formData.discountType === 'percentage' && (
            <div className="form-group">
              <label>Giảm tối đa</label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1000"
              />
              <small>Số tiền giảm tối đa (VNĐ). 0 = không giới hạn</small>
            </div>
          )}

          {/* Usage Limit */}
          <div className="form-group">
            <label>Giới hạn số lần sử dụng</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
            <small>Để trống hoặc 0 nếu không giới hạn</small>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label>
              Thời gian bắt đầu <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          {/* End Date */}
          <div className="form-group">
            <label>
              Thời gian kết thúc <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>

          {/* Applicable Products */}
          <div className="form-group full-width">
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
                className="btn-small"
                style={{ backgroundColor: '#e2e8f0', color: '#334155' }}
              >
                Chọn tất cả (theo lọc)
              </button>
              <button 
                type="button" 
                onClick={handleDeselectAll}
                className="btn-small"
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
                      <label htmlFor={`prod-${product._id}`}>
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

          {/* Is Active */}
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Kích hoạt ngay</span>
            </label>
            <small>Bỏ chọn nếu muốn tạo nhưng chưa áp dụng</small>
          </div>
        </div>

        {/* Preview */}
        <div className="preview-section">
          <h3>Xem trước</h3>
          <div className="preview-card">
            <div className="preview-code">{formData.code || 'MÃ KHUYẾN MÃI'}</div>
            <div className="preview-desc">{formData.description || 'Mô tả khuyến mãi'}</div>
            <div className="preview-value">
              Giảm: {formData.discountValue 
                ? (formData.discountType === 'percentage' 
                  ? `${formData.discountValue}%` 
                  : `${Number(formData.discountValue).toLocaleString('vi-VN')}đ`)
                : '---'}
            </div>
            {formData.minOrderValue > 0 && (
              <div className="preview-condition">
                Đơn tối thiểu: {Number(formData.minOrderValue).toLocaleString('vi-VN')}đ
              </div>
            )}
            {formData.discountType === 'percentage' && formData.maxDiscount > 0 && (
              <div className="preview-condition">
                Giảm tối đa: {Number(formData.maxDiscount).toLocaleString('vi-VN')}đ
              </div>
            )}
            <div className="preview-period">
              {formData.startDate && formData.endDate 
                ? `${new Date(formData.startDate).toLocaleDateString('vi-VN')} - ${new Date(formData.endDate).toLocaleDateString('vi-VN')}`
                : 'Chưa chọn thời gian'}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/promotions')}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
