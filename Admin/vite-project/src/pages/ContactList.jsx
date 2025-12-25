import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/Contact.css'

const ContactList = () => {
  const navigate = useNavigate()
  const { token, fetchWithAuth } = useStore()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0
  })

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchContacts = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth(`${API_URL}/contact`)

        if (!response) return;

        if (!response.ok) {
          throw new Error('Không thể lấy danh sách liên hệ')
        }

        const data = await response.json()
        setContacts(data.data || [])

        // Fetch stats
        const statsResponse = await fetchWithAuth(`${API_URL}/contact/stats/count`)

        if (statsResponse && statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.data || {})
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách liên hệ:', error)
        // alert('Không thể lấy danh sách liên hệ: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [token, navigate])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa liên hệ này?')) {
      return
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/contact/${id}`, {
        method: 'DELETE'
      })

      if (!response) return;

      if (!response.ok) {
        throw new Error('Không thể xóa liên hệ')
      }

      setContacts(contacts.filter(c => c._id !== id))
      alert('Xóa liên hệ thành công')
    } catch (error) {
      console.error('Lỗi khi xóa liên hệ:', error)
      alert('Không thể xóa liên hệ: ' + error.message)
    }
  }

  const handleViewDetail = (id) => {
    navigate(`/contact/${id}`)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { label: 'Mới', class: 'badge-new' },
      read: { label: 'Đã xem', class: 'badge-read' },
      replied: { label: 'Đã trả lời', class: 'badge-replied' },
      closed: { label: 'Đóng', class: 'badge-closed' }
    }
    return statusMap[status] || { label: status, class: 'badge-default' }
  }

  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === 'all') return true
    return contact.status === filterStatus
  })

  if (loading) {
    return <div className="contact-loading">Đang tải dữ liệu...</div>
  }

  return (
    <div className="contact-list-container">
      <div className="contact-header">
        <h1>Quản Lý Liên Hệ</h1>
        <div className="contact-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng cộng:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mới:</span>
            <span className="stat-value new">{stats.new}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Đã xem:</span>
            <span className="stat-value read">{stats.read}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Đã trả lời:</span>
            <span className="stat-value replied">{stats.replied}</span>
          </div>
        </div>
      </div>

      <div className="contact-filter">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-btn ${filterStatus === 'new' ? 'active' : ''}`}
          onClick={() => setFilterStatus('new')}
        >
          Mới
        </button>
        <button
          className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`}
          onClick={() => setFilterStatus('read')}
        >
          Đã xem
        </button>
        <button
          className={`filter-btn ${filterStatus === 'replied' ? 'active' : ''}`}
          onClick={() => setFilterStatus('replied')}
        >
          Đã trả lời
        </button>
        <button
          className={`filter-btn ${filterStatus === 'closed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('closed')}
        >
          Đóng
        </button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="no-contacts">
          <p>Không có liên hệ nào</p>
        </div>
      ) : (
        <div className="contact-list">
          <table className="contact-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, index) => {
                const statusInfo = getStatusBadge(contact.status)
                const createdDate = new Date(contact.createdAt).toLocaleDateString(
                  'vi-VN',
                  { year: 'numeric', month: '2-digit', day: '2-digit' }
                )

                return (
                  <tr key={contact._id}>
                    <td>{index + 1}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone || '-'}</td>
                    <td className="title-cell">{contact.subject}</td>
                    <td>
                      <span className={`badge ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>{createdDate}</td>
                    <td className="action-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewDetail(contact._id)}
                        title="Xem chi tiết"
                      >
                        Xem
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(contact._id)}
                        title="Xóa liên hệ"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ContactList
