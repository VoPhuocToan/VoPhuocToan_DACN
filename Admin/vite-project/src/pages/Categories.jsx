import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import '../styles/Categories.css'

const Categories = () => {
  const { token, API_URL } = useStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: ''
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/categories`)
      const data = await res.json()
      if (data.success) setCategories(data.data)
      else setError(data.message || 'Lỗi khi lấy danh mục')
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) {
      alert('Vui lòng nhập tên danh mục')
      return
    }

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
        setNewCategory({ name: '', description: '', icon: '' })
        setShowForm(false)
      } else {
        alert(data.message || 'Thêm danh mục thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi thêm danh mục')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
      } else {
        alert(data.message || 'Xóa thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi xóa danh mục')
    }
  }

  return (
    <div className='categories-page'>
      <div className='page-header'>
        <h1>Quản lý danh mục</h1>
        <button className='btn btn-primary' onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hủy' : 'Thêm danh mục'}
        </button>
      </div>

      {showForm && (
        <div className='form-card'>
          <h3>Thêm danh mục mới</h3>
          <form onSubmit={handleAddCategory}>
            <div className='form-group'>
              <label>Tên danh mục</label>
              <input
                type='text'
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder='Nhập tên danh mục'
                required
              />
            </div>
            <div className='form-group'>
              <label>Mô tả</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder='Nhập mô tả danh mục'
                rows={3}
              />
            </div>
            <div className='form-group'>
              <label>Icon (emoji)</label>
              <input
                type='text'
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                placeholder='Ví dụ: 💊 📦'
                maxLength={2}
              />
            </div>
            <button type='submit' className='btn btn-primary'>Thêm</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <table className='categories-table'>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.icon}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button className='btn btn-sm btn-danger' onClick={() => handleDeleteCategory(cat._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Categories
