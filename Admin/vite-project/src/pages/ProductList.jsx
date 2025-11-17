import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/Products.css'

const ProductList = () => {
  const { token, API_URL } = useStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/products?pageSize=1000`)
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
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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
    <div className='products-page'>
      <div className='page-header'>
        <h1>Quản lý sản phẩm</h1>
        <Link to='/products/new' className='btn btn-primary'>Thêm sản phẩm</Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <table className='products-table'>
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
                <td><img src={prod.images?.[0] || prod.image} alt={prod.name} /></td>
                <td>{prod.name}</td>
                <td>{prod.brand}</td>
                <td>{prod.price.toLocaleString('vi-VN')} ₫</td>
                <td>{prod.category}</td>
                <td>{prod.stock}</td>
                <td>
                  <Link to={`/products/${prod._id}`} className='btn btn-sm'>Sửa</Link>
                  <button className='btn btn-sm btn-danger' onClick={() => handleDelete(prod._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProductList
