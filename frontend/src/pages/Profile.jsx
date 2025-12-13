import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })

  // Address state
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=1')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap')
      return
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        district: user.district || '',
        ward: user.ward || ''
      })
    }
  }, [user, isAuthenticated, navigate])

  // Load districts and wards when editing starts or user data loads
  useEffect(() => {
    const loadAddressData = async () => {
      if (formData.city && provinces.length > 0) {
        const selectedProvince = provinces.find(p => p.name === formData.city)
        if (selectedProvince) {
          try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
            const data = await response.json()
            setDistricts(data.districts)

            if (formData.district) {
              const selectedDistrict = data.districts.find(d => d.name === formData.district)
              if (selectedDistrict) {
                const responseWard = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                const dataWard = await responseWard.json()
                setWards(dataWard.wards)
              }
            }
          } catch (error) {
            console.error('Error loading address data:', error)
          }
        }
      }
    }
    
    if (user && provinces.length > 0) {
        loadAddressData()
    }
  }, [user, provinces, formData.city, formData.district]) // Depend on user and provinces, and specific form fields if needed, but be careful of loops. 
  // Actually, if I depend on formData.city, it might trigger when user changes it. That's fine.

  const handleCityChange = async (e) => {
    const cityName = e.target.value
    setFormData(prev => ({
      ...prev,
      city: cityName,
      district: '',
      ward: ''
    }))
    setDistricts([])
    setWards([])

    const selectedProvince = provinces.find(p => p.name === cityName)
    if (selectedProvince) {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        const data = await response.json()
        setDistricts(data.districts)
      } catch (error) {
        console.error('Error fetching districts:', error)
      }
    }
  }

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value
    setFormData(prev => ({
      ...prev,
      district: districtName,
      ward: ''
    }))
    setWards([])

    const selectedDistrict = districts.find(d => d.name === districtName)
    if (selectedDistrict) {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        const data = await response.json()
        setWards(data.wards)
      } catch (error) {
        console.error('Error fetching wards:', error)
      }
    }
  }

  const handleWardChange = (e) => {
    const wardName = e.target.value
    setFormData(prev => ({
      ...prev,
      ward: wardName
    }))
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Update local storage
        const updatedUser = { ...user, ...formData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        window.dispatchEvent(new Event('userLogin'))
        
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra!' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Không thể kết nối đến server!' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      district: user.district || '',
      ward: user.ward || ''
    })
    setIsEditing(false)
    setMessage({ type: '', text: '' })
  }

  if (!user) {
    return <div className="profile-loading">Đang tải...</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <i className="fi fi-rr-user"></i>
            )}
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            {user.role === 'admin' && (
              <span className="profile-badge">👨‍💼 Quản trị viên</span>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Thông tin cá nhân</h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fi fi-rr-edit"></i>
                  Chỉnh sửa
                </button>
              )}
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                <i className={`fi ${message.type === 'success' ? 'fi-rr-check' : 'fi-rr-cross'}`}></i>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="disabled-input"
                />
                <small>Email không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label>Tỉnh / Thành phố</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!isEditing}
                  className="form-control"
                >
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  {provinces.map(province => (
                    <option key={province.code} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quận / Huyện</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!isEditing || !formData.city}
                  className="form-control"
                >
                  <option value="">Chọn Quận / Huyện</option>
                  {districts.map(district => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phường / Xã</label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleWardChange}
                  disabled={!isEditing || !formData.district}
                  className="form-control"
                >
                  <option value="">Chọn Phường / Xã</option>
                  {wards.map(ward => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Địa chỉ cụ thể (Số nhà, tên đường)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Nhập số nhà, tên đường..."
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
