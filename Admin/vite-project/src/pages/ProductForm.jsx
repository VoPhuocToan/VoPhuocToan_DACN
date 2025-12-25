import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/ProductForm.css'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, API_URL, fetchWithAuth } = useStore()
  const isEdit = !!id

  // 8 danh mục mặc định cho sản phẩm thực phẩm chức năng
  const categories = [
    { value: 'Vitamin & Khoáng chất', label: 'Vitamin & Khoáng chất' },
    { value: 'Sinh lý - Nội tiết tố', label: 'Sinh lý - Nội tiết tố' },
    { value: 'Cải thiện tăng cường chức năng', label: 'Cải thiện tăng cường chức năng' },
    { value: 'Hỗ trợ điều trị', label: 'Hỗ trợ điều trị' },
    { value: 'Hỗ trợ tiêu hóa', label: 'Hỗ trợ tiêu hóa' },
    { value: 'Thần kinh não', label: 'Thần kinh não' },
    { value: 'Hỗ trợ làm đẹp', label: 'Hỗ trợ làm đẹp' },
    { value: 'Sức khỏe tim mạch', label: 'Sức khỏe tim mạch' }
  ]

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: 0,
    originalPrice: 0,
    images: [],
    category: '',
    description: '',
    ingredients: '',
    usage: '',
    note: '',
    stock: 0,
    inStock: true
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
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
        const productData = {
          ...data.data,
          images: data.data.images || []
        }
        setForm(productData)
        // Set existing images as previews
        setImagePreviews(productData.images.map(img => {
          if (img.startsWith('http')) return img
          const baseUrl = API_URL.replace(/\/api$/, '')
          const cleanPath = img.startsWith('/') ? img.slice(1) : img
          if (cleanPath.startsWith('uploads/')) return `${baseUrl}/${cleanPath}`
          return `${baseUrl}/uploads/${cleanPath}`
        }))
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      return validTypes.includes(file.type)
    })

    if (validFiles.length !== files.length) {
      setError('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)')
      return
    }

    // Validate file size (5MB max)
    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setImageFiles(prev => [...prev, ...validFiles])

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })

    setError(null)
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      // Append all form fields
      formData.append('name', form.name)
      formData.append('brand', form.brand)
      formData.append('price', Number(form.price))
      formData.append('originalPrice', Number(form.originalPrice))
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('ingredients', form.ingredients)
      formData.append('usage', form.usage)
      formData.append('note', form.note)
      formData.append('stock', Number(form.stock))
      formData.append('inStock', form.inStock)

      // Append image files
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })

      // If editing and keeping old images
      if (isEdit && form.images && form.images.length > 0) {
        formData.append('keepOldImages', 'true')
        form.images.forEach(img => {
          formData.append('existingImages', img)
        })
      }

      const res = await fetchWithAuth(`${API_URL}/products${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData
      })
      
      if (!res) return;

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
            <select name='category' value={form.category} onChange={handleChange} required>
              <option value=''>-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
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
            <label>Hình ảnh sản phẩm</label>
            <div className='image-upload-section'>
              <div className='upload-box'>
                <input
                  type='file'
                  id='image-upload'
                  accept='image/*'
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor='image-upload' className='upload-label'>
                  <div className='upload-icon'>📷</div>
                  <p>Chọn ảnh từ máy tính</p>
                  <span className='upload-hint'>Hỗ trợ: JPG, PNG, GIF, WEBP (Tối đa 5MB)</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className='image-previews'>
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className='preview-item'>
                      <img src={preview} alt={`Preview ${idx + 1}`} />
                      <button
                        type='button'
                        className='remove-image-btn'
                        onClick={() => removeImage(idx)}
                        title='Xóa ảnh'
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
