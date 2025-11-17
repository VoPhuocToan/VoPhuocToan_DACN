import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './admin.css'

const AdminProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/products?pageSize=1000`)
      const data = await res.json()
      if (data.success) setProducts(data.data)
      else setError(data.message || 'Lỗi khi lấy sản phẩm')
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      } else {
        alert(data.message || 'Xóa thất bại')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi xóa sản phẩm')
    }
  }

  return (
    <div>
      <div className='admin-header'>
        <h1>Quản lý sản phẩm</h1>
        <Link to='/admin/products/new' className='btn'>Thêm sản phẩm</Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod._id}>
                <td><img src={prod.images?.[0] || prod.image} alt={prod.name} className='thumb' /></td>
                <td>{prod.name}</td>
                <td>{prod.brand}</td>
                <td>{prod.price.toLocaleString('vi-VN')} ₫</td>
                <td>{prod.category}</td>
                <td>{prod.stock}</td>
                <td>
                  <Link to={`/admin/products/${prod._id}`} className='btn small'>Sửa</Link>
                  <button className='btn small danger' onClick={() => handleDelete(prod._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminProductList
