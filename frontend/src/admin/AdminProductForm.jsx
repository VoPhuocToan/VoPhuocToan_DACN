import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './admin.css'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: 0,
    originalPrice: 0,
    images: [''],
    category: '',
    description: '',
    ingredients: '',
    usage: '',
    note: '',
    stock: 0,
    inStock: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) loadProduct()
  }, [id])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/products/${id}`)
      const data = await res.json()
      if (data.success) {
        setForm({
          ...data.data,
          images: data.data.images && data.data.images.length ? data.data.images : [data.data.image || '']
        })
      } else {
        setError(data.message || 'Không thể tải sản phẩm')
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index, value) => {
    const imgs = [...form.images]
    imgs[index] = value
    setForm(prev => ({ ...prev, images: imgs }))
  }

  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }))
  const removeImage = (index) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const payload = { ...form }
      // Ensure numeric fields
      payload.price = Number(payload.price)
      payload.originalPrice = Number(payload.originalPrice)
      payload.stock = Number(payload.stock)

      const res = await fetch(`${apiUrl}/api/products${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        navigate('/admin/products')
      } else {
        setError(data.message || 'Lỗi khi lưu sản phẩm')
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='admin-header'>
        <h1>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <form className='admin-form' onSubmit={handleSubmit}>
          {error && <p className='error'>{error}</p>}

          <div className='form-row'>
            <div className='form-group'>
              <label>Tên sản phẩm</label>
              <input name='name' value={form.name} onChange={handleChange} required />
            </div>
            <div className='form-group'>
              <label>Thương hiệu</label>
              <input name='brand' value={form.brand} onChange={handleChange} required />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Giá</label>
              <input name='price' type='number' value={form.price} onChange={handleChange} required />
            </div>
            <div className='form-group'>
              <label>Giá gốc</label>
              <input name='originalPrice' type='number' value={form.originalPrice} onChange={handleChange} />
            </div>
          </div>

          <div className='form-group'>
            <label>Danh mục</label>
            <input name='category' value={form.category} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Mô tả</label>
            <textarea name='description' value={form.description} onChange={handleChange} rows={4} required />
          </div>

          <div className='form-group'>
            <label>Thành phần</label>
            <input name='ingredients' value={form.ingredients} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Cách dùng</label>
            <input name='usage' value={form.usage} onChange={handleChange} required />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Ảnh</label>
              {form.images.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder='Image URL' />
                  <button type='button' onClick={() => removeImage(idx)}>Xóa</button>
                </div>
              ))}
              <button type='button' onClick={addImage}>Thêm ảnh</button>
            </div>
            <div className='form-group'>
              <label>Stock</label>
              <input name='stock' type='number' value={form.stock} onChange={handleChange} required />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Ghi chú</label>
              <input name='note' value={form.note} onChange={handleChange} />
            </div>
            <div className='form-group'>
              <label>In stock</label>
              <select name='inStock' value={form.inStock} onChange={(e) => setForm(prev => ({ ...prev, inStock: e.target.value === 'true' }))}>
                <option value='true'>Có</option>
                <option value='false'>Không</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className='btn' type='submit'>{isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button>
            <button type='button' className='btn' onClick={() => navigate('/admin/products')}>Hủy</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminProductForm
