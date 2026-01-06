import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import '../styles/Users.css'

const UserList = () => {
  const { token, API_URL, fetchWithAuth } = useStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    role: 'user',
    isActive: true
  })

  const fetchUsers = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      let url = `${API_URL}/users?page=${currentPage}&pageSize=10`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (roleFilter) url += `&role=${roleFilter}`
      if (statusFilter) url += `&isActive=${statusFilter}`

      const res = await fetchWithAuth(url)
      if (!res) return;

      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
        setTotalPages(data.pagination?.pages || 1)
      } else {
        setError(data.message || 'Lỗi khi lấy danh sách người dùng')
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [currentPage, roleFilter, statusFilter, token])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      district: user.district || '',
      ward: user.ward || '',
      role: user.role,
      isActive: user.isActive
    })
    setShowModal(true)
  }

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowModal(false)
        fetchUsers()
        alert('Cập nhật thành công!')
      } else {
        alert(data.message || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi cập nhật người dùng')
    }
  }

  const handleToggleStatus = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn ${user.isActive ? 'khóa' : 'mở khóa'} tài khoản này?`)) return
    try {
      const res = await fetchWithAuth(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !user.isActive })
      })
      
      if (!res) return;

      const data = await res.json()
      if (data.success) {
        fetchUsers()
      } else {
        alert(data.message || 'Thao tác thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi thay đổi trạng thái')
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!')) return
    try {
      const res = await fetchWithAuth(`${API_URL}/users/${user._id}`, {
        method: 'DELETE'
      })
      
      if (!res) return;

      const data = await res.json()
      if (data.success) {
        fetchUsers()
        alert('Xóa người dùng thành công!')
      } else {
        alert(data.message || 'Xóa thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi xóa người dùng')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='users-page'>
      <div className='page-header'>
        <h1>👥 Quản lý người dùng</h1>
        <div className='header-stats'>
          <span className='stat-badge'>
            Tổng: <strong>{users.length}</strong> người dùng
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className='filters-section'>
        <form onSubmit={handleSearch} className='search-form'>
          <input
            type='text'
            placeholder='Tìm theo tên, email, SĐT...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='search-input'
          />
          <button type='submit' className='btn btn-primary'>
            🔍 Tìm kiếm
          </button>
        </form>

        <div className='filter-group'>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1) }}
            className='filter-select'
          >
            <option value=''>Tất cả vai trò</option>
            <option value='user'>Khách hàng</option>
            <option value='admin'>Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className='filter-select'
          >
            <option value=''>Tất cả trạng thái</option>
            <option value='true'>Đang hoạt động</option>
            <option value='false'>Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className='error-container'>
          <p className='error'>❌ {error}</p>
          <button onClick={fetchUsers} className='btn btn-primary'>Thử lại</button>
        </div>
      ) : (
        <>
          <div className='table-container'>
            <table className='users-table'>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Thông tin</th>
                  <th>Liên hệ</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan='7' className='empty-row'>
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className='user-avatar'>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <span className='avatar-placeholder'>
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='user-info'>
                          <strong className='user-name'>{user.name}</strong>
                          <span className='user-email'>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className='contact-info'>
                          {user.phone && <span>📞 {user.phone}</span>}
                          {(user.address || user.city) && (
                            <span className='address'>
                              📍 {[user.address, user.ward, user.district, user.city].filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? '✅ Hoạt động' : '🚫 Đã khóa'}
                        </span>
                      </td>
                      <td className='date-cell'>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className='action-buttons'>
                          <button
                            className='btn btn-sm btn-info'
                            onClick={() => handleViewUser(user)}
                            title='Xem chi tiết'
                          >
                            👁️
                          </button>
                          <button
                            className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(user)}
                            title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                          >
                            {user.isActive ? '🔒' : '🔓'}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              className='btn btn-sm btn-danger'
                              onClick={() => handleDeleteUser(user)}
                              title='Xóa'
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='pagination'>
              <button
                className='btn btn-sm'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ← Trước
              </button>
              <span className='page-info'>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className='btn btn-sm'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>📝 Chi tiết người dùng</h2>
              <button className='modal-close' onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className='modal-body'>
              <div className='user-detail-header'>
                <div className='user-avatar-large'>
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : (
                    <span className='avatar-placeholder-large'>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className='user-detail-info'>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <span className={`role-badge ${selectedUser.role}`}>
                    {selectedUser.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                  </span>
                </div>
              </div>

              <div className='form-group'>
                <label>Họ tên</label>
                <input
                  type='text'
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>

              <div className='form-group'>
                <label>Email</label>
                <input
                  type='email'
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Số điện thoại</label>
                  <input
                    type='text'
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>

                <div className='form-group'>
                  <label>Vai trò</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  >
                    <option value='user'>Khách hàng</option>
                    <option value='admin'>Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className='form-group'>
                <label>Số nhà, tên đường</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  rows={2}
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Tỉnh / Thành phố</label>
                  <input
                    type='text'
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Quận / Huyện</label>
                  <input
                    type='text'
                    value={editForm.district}
                    onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Phường / Xã</label>
                <input
                  type='text'
                  value={editForm.ward}
                  onChange={(e) => setEditForm({...editForm, ward: e.target.value})}
                />
              </div>

              <div className='form-group'>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                  />
                  <span>Tài khoản đang hoạt động</span>
                </label>
              </div>

              <div className='user-meta'>
                <p><strong>ID:</strong> {selectedUser._id}</p>
                <p><strong>Ngày tạo:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>Cập nhật:</strong> {formatDate(selectedUser.updatedAt)}</p>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-secondary' onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className='btn btn-primary' onClick={handleUpdateUser}>
                💾 Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList
