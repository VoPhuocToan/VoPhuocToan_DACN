import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
  const { isAuthenticated, token, user } = useAuth()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [userId] = useState(localStorage.getItem('userId') || `guest_${Date.now()}`)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 })
  const authenticatedUserId = user ? (user._id || user.id || user.userId || user?.data?._id || user?.data?.id || null) : null

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products?pageSize=1000`)
        const data = await res.json()
        
        const list = Array.isArray(data?.data) ? data.data : 
                     Array.isArray(data?.products) ? data.products : 
                     Array.isArray(data) ? data : []
        
        const normalized = list.map(p => {
          const stock = Number(p.stock) || 0
          // Đảm bảo inStock sync với stock: nếu stock = 0 thì inStock = false
          const inStock = stock > 0 && (p.inStock !== false)
          return {
            id: p._id || p.id,
            _id: p._id || p.id,
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
            inStock: inStock,
            stock: stock
          }
        })
        
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

  // Check if product is in favorites
  useEffect(() => {
    if (!product || !isAuthenticated) {
      setIsFavorite(false)
      return
    }

    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsFavorite(false)
          return
        }

        const productId = product.id || product._id
        const response = await fetch(`${apiUrl}/api/favorites/check/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(data.isFavorite)
        }
      } catch (error) {
        console.error('Error checking favorite:', error)
        setIsFavorite(false)
      }
    }

    checkFavorite()
  }, [product, isAuthenticated, apiUrl])

  const computeReviewStats = (list, fallbackRating = 0, fallbackCount = 0) => {
    if (Array.isArray(list) && list.length > 0) {
      const avg = list.reduce((sum, review) => sum + Number(review.rating || 0), 0) / list.length
      return {
        average: Math.round(avg * 10) / 10,
        count: list.length
      }
    }

    return {
      average: typeof fallbackRating === 'number' ? Math.round(fallbackRating * 10) / 10 : 0,
      count: typeof fallbackCount === 'number' ? fallbackCount : 0
    }
  }

  const getStarSegments = (value) => {
    const safeValue = Math.min(5, Math.max(0, Math.floor(Number(value || 0))))
    return {
      filled: '★'.repeat(safeValue),
      empty: '☆'.repeat(5 - safeValue)
    }
  }

  useEffect(() => {
    if (!product) return

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/${product.id}/reviews`)
        const data = await res.json()

        if (data.success) {
          const list = Array.isArray(data.data) ? data.data : []
          setReviews(list)
          const stats = computeReviewStats(list, data.rating, data.count)
          setReviewStats(stats)
        } else {
          setReviews([])
          setReviewStats(computeReviewStats([], data?.rating, data?.count))
        }
      } catch (error) {
        console.error('Fetch reviews error:', error)
      }
    }

    fetchReviews()
  }, [product, apiUrl, authenticatedUserId])

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

  const ratingToDisplay = reviewStats.count ? reviewStats.average : product.rating
  const reviewCountToDisplay = reviewStats.count ? reviewStats.count : product.reviews
  const roundedRating = Number(ratingToDisplay || 0)
  const mainStars = getStarSegments(roundedRating)

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleToggleFavorite = async () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích')
      navigate('/dang-nhap')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const productId = product.id || product._id

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`${apiUrl}/api/favorites/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(false)
          alert('Đã xóa khỏi danh sách yêu thích')
          // Dispatch event to update other components
          window.dispatchEvent(new Event('favoritesUpdated'))
        } else {
          alert(data.message || 'Không thể xóa khỏi danh sách yêu thích')
        }
      } else {
        // Add to favorites
        const response = await fetch(`${apiUrl}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(true)
          alert('Đã thêm vào danh sách yêu thích')
          // Dispatch event to update other components
          window.dispatchEvent(new Event('favoritesUpdated'))
        } else {
          alert(data.message || 'Không thể thêm vào danh sách yêu thích')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Lỗi khi cập nhật danh sách yêu thích')
    }
  }

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/dang-nhap')
      return
    }

    // Kiểm tra stock
    if (!product.inStock || product.stock === 0) {
      alert('Sản phẩm đã hết hàng')
      return
    }

    // Kiểm tra số lượng
    if (quantity > product.stock) {
      alert(`Số lượng vượt quá tồn kho. Chỉ còn ${product.stock} sản phẩm`)
      return
    }
    
    try {
      const userIdToUse = localStorage.getItem('userId') || userId
      if (!localStorage.getItem('userId')) localStorage.setItem('userId', userIdToUse)

      const payload = {
        userId: userIdToUse,
        quantity,
        productId: product.id || product._id, // Thêm productId để backend có thể tìm sản phẩm
        clientProductId: String(product.id),
        productData: {
          name: product.name,
          price: product.price,
          image: product.image
        }
      }

      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Đã thêm sản phẩm vào giỏ hàng')
        // Dùng navigate thay vì window.location.href
        navigate('/gio-hang')
      } else {
        alert(data.message || 'Không thể thêm vào giỏ hàng')
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      alert('Lỗi khi thêm vào giỏ hàng')
    }
  }

  const handleBuyNow = async () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua hàng')
      navigate('/dang-nhap')
      return
    }

    // Kiểm tra stock
    if (!product.inStock || product.stock === 0) {
      alert('Sản phẩm đã hết hàng')
      return
    }

    // Kiểm tra số lượng
    if (quantity > product.stock) {
      alert(`Số lượng vượt quá tồn kho. Chỉ còn ${product.stock} sản phẩm`)
      return
    }

    try {
      const userIdToUse = localStorage.getItem('userId') || userId
      if (!localStorage.getItem('userId')) localStorage.setItem('userId', userIdToUse)

      const payload = {
        userId: userIdToUse,
        quantity,
        productId: product.id || product._id,
        clientProductId: String(product.id),
        productData: {
          name: product.name,
          price: product.price,
          image: product.image
        }
      }

      // Thêm vào giỏ hàng trước
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (data.success) {
        // Chuyển đến trang checkout
        navigate('/checkout')
      } else {
        alert(data.message || 'Không thể thêm vào giỏ hàng')
      }
    } catch (err) {
      console.error('Buy now error:', err)
      alert('Lỗi khi thêm vào giỏ hàng')
    }
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
            <div className='product-header-row'>
              <div>
                <div className='product-brand-detail'>{product.brand}</div>
                <h1 className='product-title'>{product.name}</h1>
              </div>
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                <i className={`fi ${isFavorite ? 'fi-sr-heart' : 'fi-rr-heart'}`}></i>
              </button>
            </div>
            
            <div className='product-rating-detail'>
              <span className='stars'>
                {mainStars.filled}{mainStars.empty}
              </span>
              <span className='rating-value'>{roundedRating.toFixed(1)}</span>
              <span className='reviews'>({reviewCountToDisplay} đánh giá)</span>
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

              {product.inStock && product.stock > 0 ? (
                <div className='action-buttons'>
                  <button className='btn-add-cart' onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </button>
                  <button className='btn-buy-now' onClick={handleBuyNow}>
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

          <div className='tab-content reviews-section'>
            <h3>Đánh giá sản phẩm</h3>
            <div className='review-summary'>
              <div className='summary-score'>
                <div className='score-value'>{roundedRating.toFixed(1)}</div>
                <div className='score-stars'>{mainStars.filled}{mainStars.empty}</div>
                <div className='score-count'>{reviewCountToDisplay} đánh giá</div>
              </div>
              <div className='summary-info'>
                <p>Sản phẩm chỉ hiển thị tối đa 5 đánh giá mới nhất.</p>
                <p>Để đánh giá sản phẩm, vui lòng vào mục <strong>Đơn hàng của tôi</strong> sau khi đã mua và nhận hàng thành công.</p>
              </div>
            </div>

            <div className='review-list'>
              {reviews.length === 0 ? (
                <p className='no-reviews'>Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                reviews.map((review, index) => {
                  const reviewerName = review.user?.name || 'Người dùng ẩn danh'
                  const reviewStars = getStarSegments(review.rating)
                  const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''

                  return (
                    <div className='review-item' key={review._id || `${review.user}-${index}`}>
                      <div className='review-header'>
                        <div className='review-author'>{reviewerName}</div>
                        <div className='review-meta'>
                          <span className='review-stars'>{reviewStars.filled}{reviewStars.empty}</span>
                          {reviewDate && <span className='review-date'>{reviewDate}</span>}
                        </div>
                      </div>
                      {review.comment && <p className='review-comment'>{review.comment}</p>}
                    </div>
                  )
                })
              )}
            </div>
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

