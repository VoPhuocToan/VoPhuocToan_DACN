import { useState, useEffect } from 'react';
import '../styles/CommentList.css';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/products/admin/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        alert('Đã xóa bình luận');
        fetchComments();
      } else {
        alert('Lỗi khi xóa bình luận');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReply = async (productId, reviewId) => {
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/products/${productId}/reviews/${reviewId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: replyText })
      });

      if (res.ok) {
        alert('Đã trả lời bình luận');
        setReplyingTo(null);
        setReplyText('');
        fetchComments();
      } else {
        alert('Lỗi khi trả lời bình luận');
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      comment.productName.toLowerCase().includes(searchLower) ||
      (comment.user?.name || 'Unknown').toLowerCase().includes(searchLower) ||
      comment.comment.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="comment-management">
      <div className="page-header">
        <h1>Quản lý Bình luận & Đánh giá</h1>
      </div>

      {/* Search */}
      <div className="controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, người dùng, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Comments List */}
      <div className="comments-container">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : filteredComments.length === 0 ? (
          <div className="no-data">Không có bình luận nào</div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <div className="comment-header">
                <div className="product-info">
                  <span className="product-name">{comment.productName}</span>
                </div>
                <span className="date">📅 {formatDate(comment.createdAt)}</span>
              </div>

              <div className="comment-body">
                <div className="user-info">
                  <div className="avatar">{(comment.user?.name || 'U').charAt(0)}</div>
                  <div>
                    <div className="user-name">{comment.user?.name || 'Unknown User'}</div>
                    <div className="user-email">{comment.user?.email}</div>
                  </div>
                </div>

                <div className="rating">
                  <span className="stars">{renderStars(comment.rating)}</span>
                  <span className="rating-value">{comment.rating}/5</span>
                </div>

                <div className="comment-text">
                  "{comment.comment}"
                </div>

                {/* Admin Reply Display */}
                {comment.reply && (
                  <div className="admin-reply">
                    <div className="reply-header">
                      <strong>Admin trả lời:</strong>
                      <span className="reply-date">{formatDate(comment.reply.createdAt)}</span>
                    </div>
                    <div className="reply-content">{comment.reply.comment}</div>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="reply-form">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập nội dung trả lời..."
                    />
                    <div className="reply-actions">
                      <button 
                        className="btn-submit"
                        onClick={() => handleReply(comment.productId, comment._id)}
                      >
                        Gửi trả lời
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="comment-actions">
                {!comment.reply && !replyingTo && (
                  <button 
                    className="btn-reply"
                    onClick={() => setReplyingTo(comment._id)}
                  >
                    💬 Trả lời
                  </button>
                )}
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(comment.productId, comment._id)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
