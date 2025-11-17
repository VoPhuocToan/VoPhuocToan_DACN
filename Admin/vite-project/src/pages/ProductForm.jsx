import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/ProductForm.css'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, API_URL } = useStore()
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
      const res = await fetch(`${API_URL}/products/${id}`)
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
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock)
      }

      const res = await fetch(`${API_URL}/products${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        navigate('/products')
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
    <div className='product-form-page'>
      <h1>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>

      {loading ? <p>Đang tải...</p> : (
        <form onSubmit={handleSubmit} className='product-form'>
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

          <div className='form-group'>
            <label>Ảnh</label>
            {form.images.map((img, idx) => (
              <div key={idx} className='image-input-group'>
                <input value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder='Image URL' />
                <button type='button' onClick={() => removeImage(idx)}>Xóa</button>
              </div>
            ))}
            <button type='button' onClick={addImage} className='btn btn-sm'>Thêm ảnh</button>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Stock</label>
              <input name='stock' type='number' value={form.stock} onChange={handleChange} required />
            </div>
            <div className='form-group'>
              <label>Ghi chú</label>
              <input name='note' value={form.note} onChange={handleChange} />
            </div>
          </div>

          <div className='form-actions'>
            <button type='submit' className='btn btn-primary'>{isEdit ? 'Lưu' : 'Tạo'}</button>
            <button type='button' className='btn' onClick={() => navigate('/products')}>Hủy</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductForm
