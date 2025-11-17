import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { products } from '../data/products'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === parseInt(id))
  const [quantity, setQuantity] = useState(1)

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
    // TODO: Implement add to cart functionality
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
  }

  const relatedProducts = products
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
              <img src={product.image} alt={product.name} />
              {discount > 0 && (
                <div className='discount-badge'>-{discount}%</div>
              )}
            </div>
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
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
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

