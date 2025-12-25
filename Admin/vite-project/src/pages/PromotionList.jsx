import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/PromotionList.css';

const PromotionList = () => {
  const navigate = useNavigate();
  const { token, fetchWithAuth } = useStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive, expired
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    inactive: 0,
    expired: 0
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [promotions]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}/promotions`);
      if (!response) return;
      
      const data = await response.json();
      setPromotions(data.data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      alert('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    
    const active = promotions.filter(p => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return p.isActive && now >= start && now <= end;
    }).length;

    const upcoming = promotions.filter(p => {
      const start = new Date(p.startDate);
      return p.isActive && now < start;
    }).length;
    
    const expired = promotions.filter(p => {
      const end = new Date(p.endDate);
      return now > end;
    }).length;
    
    const inactive = promotions.filter(p => !p.isActive).length;

    setStats({
      total: promotions.length,
      active,
      upcoming,
      inactive,
      expired
    });
  };

  const getPromotionStatus = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (!promotion.isActive) return 'inactive';
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) return 'limit-reached';
    return 'active';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Đang hoạt động',
      'inactive': 'Ngừng hoạt động',
      'expired': 'Đã hết hạn',
      'upcoming': 'Sắp diễn ra',
      'limit-reached': 'Hết lượt dùng'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'active': '#10b981',
      'inactive': '#6b7280',
      'expired': '#ef4444',
      'upcoming': '#3b82f6',
      'limit-reached': '#f59e0b'
    };
    return colorMap[status] || '#6b7280';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã khuyến mãi này?')) return;

    try {
      const response = await fetchWithAuth(`${API_URL}/promotions/${id}`, {
        method: 'DELETE'
      });
      
      if (!response) return;

      alert('Xóa thành công!');
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Không thể xóa khuyến mãi');
    }
  };

  const handleToggleActive = async (promotion) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/promotions/${promotion._id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...promotion, isActive: !promotion.isActive })
      });

      if (!response) return;

      alert('Cập nhật trạng thái thành công!');
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDiscount = (promotion) => {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}%`;
    }
    return `${promotion.discountValue.toLocaleString('vi-VN')}đ`;
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchSearch = 
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;

    if (filterStatus === 'all') return true;
    
    const status = getPromotionStatus(promotion);
    if (filterStatus === 'active') return status === 'active';
    if (filterStatus === 'upcoming') return status === 'upcoming';
    if (filterStatus === 'inactive') return status === 'inactive';
    if (filterStatus === 'expired') return status === 'expired';
    
    return true;
  });

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="promotion-management">
      <div className="page-header">
        <h1>Quản lý Khuyến mãi</h1>
        <button className="btn-add" onClick={() => navigate('/promotions/new')}>
          ➕ Thêm khuyến mãi
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div 
          className="stat-card total"
          onClick={() => setFilterStatus('all')}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Tổng số</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        <div 
          className="stat-card active"
          onClick={() => setFilterStatus('active')}
        >
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Đang hoạt động</h3>
            <p className="stat-number">{stats.active}</p>
          </div>
        </div>
        <div 
          className="stat-card upcoming"
          onClick={() => setFilterStatus('upcoming')}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Sắp diễn ra</h3>
            <p className="stat-number">{stats.upcoming}</p>
          </div>
        </div>
        <div 
          className="stat-card inactive"
          onClick={() => setFilterStatus('inactive')}
        >
          <div className="stat-icon">⏸️</div>
          <div className="stat-info">
            <h3>Tạm dừng</h3>
            <p className="stat-number">{stats.inactive}</p>
          </div>
        </div>
        <div 
          className="stat-card expired"
          onClick={() => setFilterStatus('expired')}
        >
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Đã hết hạn</h3>
            <p className="stat-number">{stats.expired}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm mã hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Promotions Table */}
      <div className="promotions-table-container">
        {filteredPromotions.length === 0 ? (
          <div className="no-data">Không có khuyến mãi nào</div>
        ) : (
          <table className="promotions-table">
            <thead>
              <tr>
                <th>Mã khuyến mãi</th>
                <th>Mô tả</th>
                <th>Loại giảm</th>
                <th>Giá trị</th>
                <th>Thời gian</th>
                <th>Đã dùng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promotion) => {
                const status = getPromotionStatus(promotion);
                return (
                  <tr key={promotion._id}>
                    <td>
                      <span className="promo-code">{promotion.code}</span>
                    </td>
                    <td>
                      <div className="promo-desc">
                        {promotion.description}
                        {promotion.minOrderValue > 0 && (
                          <small>Đơn tối thiểu: {promotion.minOrderValue.toLocaleString('vi-VN')}đ</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="discount-type">
                        {promotion.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                      </span>
                    </td>
                    <td className="discount-value">{formatDiscount(promotion)}</td>
                    <td>
                      <div className="date-range">
                        <div>{formatDate(promotion.startDate)}</div>
                        <div>{formatDate(promotion.endDate)}</div>
                      </div>
                    </td>
                    <td className="usage-stats">
                      {promotion.usedCount} / {promotion.usageLimit || '∞'}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ background: getStatusColor(status) }}
                      >
                        {getStatusText(status)}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-toggle"
                          onClick={() => handleToggleActive(promotion)}
                          title={promotion.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                          style={{
                            background: promotion.isActive ? '#fef3c7' : '#d1fae5',
                            color: promotion.isActive ? '#d97706' : '#059669'
                          }}
                        >
                          <i className={`fi ${promotion.isActive ? 'fi-rr-pause' : 'fi-rr-play'}`}></i>
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => navigate(`/promotions/edit/${promotion._id}`)}
                          title="Chỉnh sửa"
                        >
                          <i className="fi fi-rr-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(promotion._id)}
                          title="Xóa"
                        >
                          <i className="fi fi-rr-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PromotionList;
