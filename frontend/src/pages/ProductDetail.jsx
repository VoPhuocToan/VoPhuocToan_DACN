import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/products'
import './ProductDetail.css'

// Import all images from assets folder
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const resolveImageSrc = (img) => {
  if (!img) return ''
  const imgStr = String(img)
  
  // If it's already a full URL, return it
  if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
    return imgStr
  }
  
  // If it's a server upload path (starts with /uploads), prepend API URL
  if (imgStr.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    return `${apiUrl}${imgStr}`
  }
  
  // Look for the image in our imported images
  const imagePath = `../assets/${imgStr}`
  if (images[imagePath]) {
    return images[imagePath]
  }
  
  // If not found, return a placeholder or the original string
  console.warn(`Image not found: ${imgStr}`)
  return imgStr
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [userId] = useState(localStorage.getItem('userId') || `guest_${Date.now()}`)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/api/products?pageSize=1000`)
        const data = await res.json()
        
        const list = Array.isArray(data?.data) ? data.data : 
                     Array.isArray(data?.products) ? data.products : 
                     Array.isArray(data) ? data : []
        
        const normalized = list.map(p => ({
          id: p._id || p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image || (Array.isArray(p.images) ? p.images[0] : ''),
          images: Array.isArray(p.images) ? p.images : [p.image],
          category: p.category,
          description: p.description,
          ingredients: p.ingredients,
          usage: p.usage,
          note: p.note,
          rating: typeof p.rating === 'number' ? p.rating : 0,
          reviews: typeof p.numReviews === 'number' ? p.numReviews : 0,
          inStock: p.inStock !== false
        }))
        
        setAllProducts(normalized)
        const foundProduct = normalized.find(p => p.id === id)
        setProduct(foundProduct || null)
        if (foundProduct) {
          setSelectedImage(foundProduct.image)
        }
        setLoading(false)
      } catch (e) {
        console.error('Fetch products error:', e)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [id])

  if (loading) {
    return (
      <div className='product-detail-page'>
        <div className='container'>
          <div className='loading'>Đang tải...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='product-detail-page'>
        <div className='container'>
          <div className='not-found'>
            <h2>Sản phẩm không tồn tại</h2>
            <Link to='/thuc-pham-chuc-nang' className='btn-primary'>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const totalPrice = product.price * quantity

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/login')
      return
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const userIdToUse = localStorage.getItem('userId') || userId
    if (!localStorage.getItem('userId')) localStorage.setItem('userId', userIdToUse)

    const payload = {
      userId: userIdToUse,
      quantity,
      // send client-side id so backend can match or store as clientProductId
      clientProductId: String(product.id),
      // provide product data so backend can add even if productId isn't a DB id
      productData: {
        name: product.name,
        price: product.price,
        image: product.image
      }
    }

    fetch(`${apiUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // navigate to cart page
          alert('Đã thêm sản phẩm vào giỏ hàng')
          window.location.href = '/gio-hang'
        } else {
          alert(data.message || 'Không thể thêm vào giỏ hàng')
        }
      })
      .catch(err => {
        console.error('Add to cart error:', err)
        alert('Lỗi khi thêm vào giỏ hàng')
      })
  }

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className='product-detail-page'>
      <div className='container'>
        <nav className='breadcrumb'>
          <Link to='/'>Trang chủ</Link>
          <span>/</span>
          <Link to='/thuc-pham-chuc-nang'>Thực phẩm chức năng</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className='product-detail-content'>
          <div className='product-images'>
            <div className='main-image'>
              <img src={resolveImageSrc(selectedImage || product.image)} alt={product.name} />
              {discount > 0 && (
                <div className='discount-badge'>-{discount}%</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className='thumbnail-images'>
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={resolveImageSrc(img)} alt={`${product.name} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='product-info-detail'>
            <div className='product-brand-detail'>{product.brand}</div>
            <h1 className='product-title'>{product.name}</h1>
            
            <div className='product-rating-detail'>
              <span className='stars'>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className='rating-value'>{product.rating}</span>
              <span className='reviews'>({product.reviews} đánh giá)</span>
            </div>

            <div className='product-price-detail'>
              <span className='current-price'>{product.price.toLocaleString('vi-VN')}đ</span>
              {product.originalPrice && (
                <span className='original-price'>{product.originalPrice.toLocaleString('vi-VN')}đ</span>
              )}
            </div>

            <div className='product-description-short'>
              <p>{product.description}</p>
            </div>

            <div className='product-actions'>
              <div className='quantity-control'>
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min='1'
                />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>

              {product.inStock ? (
                <div className='action-buttons'>
                  <button className='btn-add-cart' onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </button>
                  <button className='btn-buy-now'>
                    Mua ngay
                  </button>
                </div>
              ) : (
                <button className='btn-out-of-stock' disabled>
                  Hết hàng
                </button>
              )}
            </div>

            <div className='product-features'>
              <div className='feature-item'>
                <span className='feature-icon'>✓</span>
                <span>Chính hãng 100%</span>
              </div>
              <div className='feature-item'>
                <span className='feature-icon'>🚚</span>
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className='feature-item'>
                <span className='feature-icon'>↩️</span>
                <span>Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        <div className='product-tabs'>
          <div className='tab-content'>
            <h3>Thành phần</h3>
            <p>{product.ingredients}</p>
          </div>
          <div className='tab-content'>
            <h3>Cách sử dụng</h3>
            <p>{product.usage}</p>
          </div>
          <div className='tab-content'>
            <h3>Lưu ý</h3>
            <p>{product.note}</p>
          </div>
          <div className='tab-content'>
            <h3>Mô tả chi tiết</h3>
            <p>{product.description}</p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className='related-products'>
            <h2>Sản phẩm liên quan</h2>
            <div className='related-products-grid'>
              {relatedProducts.map(relatedProduct => (
                <div
                  key={relatedProduct.id}
                  className='related-product-card'
                  onClick={() => navigate(`/thuc-pham-chuc-nang/${relatedProduct.id}`)}
                >
                  <img src={resolveImageSrc(relatedProduct.image)} alt={relatedProduct.name} />
                  <h4>{relatedProduct.name}</h4>
                  <div className='related-product-price'>
                    {relatedProduct.price.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

