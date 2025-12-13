import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/PromotionForm.css';

const PromotionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

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
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchPromotion();
    }
  }, [id]);

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const promotion = response.data.data;
      
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
        isActive: promotion.isActive
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
      const token = localStorage.getItem('adminToken');
      
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: Number(formData.maxDiscount) || 0,
        usageLimit: Number(formData.usageLimit) || 0
      };

      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/promotions/${id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Cập nhật khuyến mãi thành công!');
      } else {
        await axios.post(
          'http://localhost:5000/api/promotions',
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Tạo khuyến mãi thành công!');
      }
      
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error saving promotion:', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Không thể lưu khuyến mãi';
      alert(message);
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
        <button className="btn-back" onClick={() => navigate('/admin/promotions')}>
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
              placeholder="VD: SUMMER2024"
              className={errors.code ? 'error' : ''}
              disabled={isEditMode}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
            <small>Mã sẽ tự động chuyển thành chữ in hoa</small>
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
