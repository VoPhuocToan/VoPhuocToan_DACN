import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/Contact.css'

const ContactDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useStore()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchContact = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:5000/api/contact/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Không thể lấy thông tin liên hệ')
        }

        const data = await response.json()
        setContact(data.data)
        setReply(data.data.reply || '')
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết liên hệ:', error)
        alert('Không thể lấy thông tin liên hệ: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [id, token, navigate])

  const handleSubmitReply = async (e) => {
    e.preventDefault()

    if (!reply.trim()) {
      alert('Vui lòng nhập nội dung trả lời')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(
        `http://localhost:5000/api/contact/${id}/reply`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reply: reply.trim() })
        }
      )

      if (!response.ok) {
        throw new Error('Không thể gửi trả lời')
      }

      const data = await response.json()
      setContact(data.data)
      alert('Gửi trả lời thành công')
    } catch (error) {
      console.error('Lỗi khi gửi trả lời:', error)
      alert('Không thể gửi trả lời: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseContact = async () => {
    if (!window.confirm('Bạn chắc chắn muốn đóng liên hệ này?')) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/${id}/close`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Không thể đóng liên hệ')
      }

      const data = await response.json()
      setContact(data.data)
      alert('Đóng liên hệ thành công')
    } catch (error) {
      console.error('Lỗi khi đóng liên hệ:', error)
      alert('Không thể đóng liên hệ: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bạn chắc chắn muốn xóa liên hệ này?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể xóa liên hệ')
      }

      alert('Xóa liên hệ thành công')
      navigate('/contact')
    } catch (error) {
      console.error('Lỗi khi xóa liên hệ:', error)
      alert('Không thể xóa liên hệ: ' + error.message)
    }
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

  if (loading) {
    return <div className="contact-loading">Đang tải dữ liệu...</div>
  }

  if (!contact) {
    return <div className="contact-error">Không tìm thấy liên hệ</div>
  }

  const statusInfo = getStatusBadge(contact.status)
  const createdDate = new Date(contact.createdAt).toLocaleString('vi-VN')
  const repliedDate = contact.repliedAt
    ? new Date(contact.repliedAt).toLocaleString('vi-VN')
    : null

  return (
    <div className="contact-detail-container">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/contact')}>
          ← Quay lại
        </button>
        <h1>Chi Tiết Liên Hệ</h1>
        <span className={`badge ${statusInfo.class} large`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <h2>Thông Tin Liên Hệ</h2>
          <div className="detail-field">
            <label>Tên khách hàng:</label>
            <p>{contact.name}</p>
          </div>
          <div className="detail-field">
            <label>Email:</label>
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>
          <div className="detail-field">
            <label>Số điện thoại:</label>
            <p>
              {contact.phone ? (
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              ) : (
                'Không cung cấp'
              )}
            </p>
          </div>
          <div className="detail-field">
            <label>Ngày gửi:</label>
            <p>{createdDate}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Nội Dung Liên Hệ</h2>
          <div className="detail-field">
            <label>Tiêu đề:</label>
            <p className="title-text">{contact.subject}</p>
          </div>
          <div className="detail-field full-width">
            <label>Nội dung tin nhắn:</label>
            <div className="message-box">{contact.message}</div>
          </div>
        </div>

        {contact.reply && (
          <div className="detail-section reply-section">
            <h2>Câu Trả Lời</h2>
            <div className="detail-field">
              <label>Ngày trả lời:</label>
              <p>{repliedDate}</p>
            </div>
            <div className="detail-field full-width">
              <label>Nội dung trả lời:</label>
              <div className="reply-box">{contact.reply}</div>
            </div>
          </div>
        )}
      </div>

      {contact.status !== 'replied' && contact.status !== 'closed' && (
        <div className="detail-section reply-form-section">
          <h2>Gửi Trả Lời</h2>
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập nội dung trả lời..."
              rows={6}
              required
            />
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi Trả Lời'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="detail-actions">
        {contact.status !== 'closed' && (
          <button className="close-btn" onClick={handleCloseContact}>
            Đóng Liên Hệ
          </button>
        )}
        <button className="delete-btn" onClick={handleDelete}>
          Xóa Liên Hệ
        </button>
      </div>
    </div>
  )
}

export default ContactDetail
