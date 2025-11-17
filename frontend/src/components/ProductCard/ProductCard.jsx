import React from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className='product-card'>
      <Link to={`/thuc-pham-chuc-nang/${product.id}`} className='product-link'>
        {discount > 0 && (
          <div className='product-badge'>-{discount}%</div>
        )}
        <div className='product-image-container'>
          <img src={product.image} alt={product.name} className='product-image' />
        </div>
        <div className='product-info'>
          <div className='product-brand'>{product.brand}</div>
          <h3 className='product-name'>{product.name}</h3>
          <div className='product-rating'>
            <span className='stars'>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className='rating-value'>({product.rating})</span>
            <span className='reviews'>{product.reviews} đánh giá</span>
          </div>
          <div className='product-price'>
            <span className='current-price'>{product.price.toLocaleString('vi-VN')}đ</span>
            {product.originalPrice && (
              <span className='original-price'>{product.originalPrice.toLocaleString('vi-VN')}đ</span>
            )}
          </div>
          {!product.inStock && (
            <div className='out-of-stock'>Hết hàng</div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

