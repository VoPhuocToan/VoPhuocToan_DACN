import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import '../styles/Revenue.css';

const Revenue = () => {
  const { token, API_URL, fetchWithAuth } = useStore();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [filterType, setFilterType] = useState('month'); // day, week, month, year, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState('line'); // line, bar, area
  
  // Detail modal state
  const [selectedDateOrders, setSelectedDateOrders] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (token) {
      fetchRevenueData();
    }
  }, [token, filterType, startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/orders/revenue-stats?filter=${filterType}`;
      
      if (filterType === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetchWithAuth(url);
      if (!response) return;

      const data = await response.json();
      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (dateStr) => {
    setSelectedDate(dateStr);
    setShowDetailModal(true);
    setDetailLoading(true);
    try {
      // Assuming dateStr is YYYY-MM-DD
      const start = new Date(dateStr);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);

      const response = await fetch(`${API_URL}/orders?startDate=${start.toISOString()}&endDate=${end.toISOString()}&pageSize=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedDateOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching date orders:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderChart = () => {
    if (!revenueData || !revenueData.chartData) return null;

    const chartProps = {
      data: revenueData.chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              <Bar dataKey="orders" fill="#82ca9d" name="Số đơn" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default: // line
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Doanh thu" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Số đơn" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="revenue-page">
      <div className="page-header">
        <h1>💰 Thống Kê Doanh Thu</h1>
      </div>

      {/* Filter Controls */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Bộ lọc thời gian:</label>
          <div className="filter-buttons">
            <button
              className={filterType === 'day' ? 'active' : ''}
              onClick={() => setFilterType('day')}
            >
              Ngày
            </button>
            <button
              className={filterType === 'week' ? 'active' : ''}
              onClick={() => setFilterType('week')}
            >
              Tuần
            </button>
            <button
              className={filterType === 'month' ? 'active' : ''}
              onClick={() => setFilterType('month')}
            >
              Tháng
            </button>
            <button
              className={filterType === 'year' ? 'active' : ''}
              onClick={() => setFilterType('year')}
            >
              Năm
            </button>
            <button
              className={filterType === 'custom' ? 'active' : ''}
              onClick={() => setFilterType('custom')}
            >
              Tùy chỉnh
            </button>
          </div>
        </div>

        {filterType === 'custom' && (
          <div className="date-range-picker">
            <div className="date-input-group">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input-group">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn-apply"
              onClick={fetchRevenueData}
              disabled={!startDate || !endDate}
            >
              Áp dụng
            </button>
          </div>
        )}

        <div className="filter-group">
          <label>Loại biểu đồ:</label>
          <div className="filter-buttons">
            <button
              className={chartType === 'line' ? 'active' : ''}
              onClick={() => setChartType('line')}
            >
              📈 Đường
            </button>
            <button
              className={chartType === 'bar' ? 'active' : ''}
              onClick={() => setChartType('bar')}
            >
              📊 Cột
            </button>
            <button
              className={chartType === 'area' ? 'active' : ''}
              onClick={() => setChartType('area')}
            >
              📉 Vùng
            </button>
          </div>
        </div>
      </div>

      {revenueData && (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card total-revenue">
              <div className="card-icon">💵</div>
              <div className="card-content">
                <h3>Tổng Doanh Thu</h3>
                <p className="amount">{formatCurrency(revenueData.summary.totalRevenue)}</p>
                <span className="period">{revenueData.summary.period}</span>
              </div>
            </div>

            <div className="summary-card total-orders">
              <div className="card-icon">📦</div>
              <div className="card-content">
                <h3>Tổng Đơn Hàng</h3>
                <p className="amount">{revenueData.summary.totalOrders}</p>
                <span className="period">Đã giao thành công</span>
              </div>
            </div>

            <div className="summary-card avg-order">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>Giá Trị TB/Đơn</h3>
                <p className="amount">{formatCurrency(revenueData.summary.averageOrderValue)}</p>
                <span className="period">Trung bình</span>
              </div>
            </div>

            <div className="summary-card growth">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Tăng Trưởng</h3>
                <p className="amount">{revenueData.summary.growth || 0}%</p>
                <span className="period">So với kỳ trước</span>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="chart-container">
            <h2>Biểu Đồ Doanh Thu Theo {filterType === 'day' ? 'Ngày' : filterType === 'week' ? 'Tuần' : filterType === 'month' ? 'Tháng' : filterType === 'year' ? 'Năm' : 'Thời Gian'}</h2>
            {renderChart()}
          </div>

          {/* Additional Charts Row */}
          <div className="charts-row">
            {/* Payment Method Distribution */}
            <div className="chart-box">
              <h3>Phân Bố Phương Thức Thanh Toán</h3>
              {revenueData.paymentMethods && revenueData.paymentMethods.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData.paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueData.paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">Không có dữ liệu</p>
              )}
            </div>

            {/* Top Products */}
            <div className="chart-box">
              <h3>Top 5 Sản Phẩm Bán Chạy</h3>
              {revenueData.topProducts && revenueData.topProducts.length > 0 ? (
                <div className="top-products-list">
                  {revenueData.topProducts.map((product, index) => (
                    <div key={index} className="product-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="product-info">
                        <strong>{product.name}</strong>
                        <small>{product.quantity} sản phẩm</small>
                      </div>
                      <span className="revenue">{formatCurrency(product.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">Không có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Detailed Table */}
          <div className="revenue-table-container">
            <h2>Chi Tiết Doanh Thu</h2>
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Số Đơn Hàng</th>
                  <th>Doanh Thu</th>
                  <th>Giá Trị TB</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.chartData && revenueData.chartData.map((item, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleDateClick(item.date)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                    className="revenue-row"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td>{item.date}</td>
                    <td>{item.orders}</td>
                    <td className="revenue-cell">{formatCurrency(item.revenue)}</td>
                    <td>{formatCurrency(item.orders > 0 ? item.revenue / item.orders : 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Tổng cộng</strong></td>
                  <td><strong>{revenueData.summary.totalOrders}</strong></td>
                  <td className="revenue-cell"><strong>{formatCurrency(revenueData.summary.totalRevenue)}</strong></td>
                  <td><strong>{formatCurrency(revenueData.summary.averageOrderValue)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng ngày {formatDate(selectedDate)}</h2>
              <button className="close-button" onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            
            {detailLoading ? (
              <div className="loading">Đang tải...</div>
            ) : selectedDateOrders.length === 0 ? (
              <p className="no-data">Không có đơn hàng nào trong ngày này</p>
            ) : (
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDateOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.user?.name || 'Khách vãng lai'}</td>
                      <td>
                        {order.orderItems.map(item => (
                          <div key={item._id} style={{marginBottom: '4px'}}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td>{formatCurrency(order.totalPrice)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status === 'pending' ? 'Chờ xử lý' :
                           order.status === 'processing' ? 'Đang xử lý' :
                           order.status === 'shipping' ? 'Đang giao' :
                           order.status === 'delivered' ? 'Đã giao' :
                           order.status === 'cancelled' ? 'Đã hủy' : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
