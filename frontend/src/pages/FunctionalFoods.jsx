import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import { products, categories } from '../data/products'
import './FunctionalFoods.css'

const FunctionalFoods = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Tất cả')
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    let filtered = products

    // Lọc theo danh mục
    if (selectedCategory && selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Lọc theo khoảng giá
    if (priceRange !== 'all') {
      filtered = filtered.filter(p => {
        if (priceRange === 'under-300') return p.price < 300000
        if (priceRange === '300-500') return p.price >= 300000 && p.price < 500000
        if (priceRange === '500-700') return p.price >= 500000 && p.price < 700000
        if (priceRange === 'over-700') return p.price >= 700000
        return true
      })
    }

    // Sắp xếp
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi')
      return 0
    })

    setFilteredProducts(sorted)
  }, [selectedCategory, sortBy, priceRange])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (category === 'Tất cả') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  return (
    <div className='functional-foods-page'>
      <div className='container'>
        <div className='page-header'>
          <h1>Thực phẩm chức năng</h1>
          <p>Tổng hợp các sản phẩm thực phẩm chức năng chất lượng cao</p>
        </div>

        <div className='products-layout'>
          {/* Sidebar Filters */}
          <aside className='filters-sidebar'>
            <div className='filter-section'>
              <h3>Danh mục</h3>
              <ul className='category-list'>
                {categories.map(category => (
                  <li key={category}>
                    <button
                      className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className='filter-section'>
              <h3>Khoảng giá</h3>
              <div className='price-filters'>
                <label>
                  <input
                    type='radio'
                    name='price'
                    value='all'
                    checked={priceRange === 'all'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>Tất cả</span>
                </label>
                <label>
                  <input
                    type='radio'
                    name='price'
                    value='under-300'
                    checked={priceRange === 'under-300'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>Dưới 300.000đ</span>
                </label>
                <label>
                  <input
                    type='radio'
                    name='price'
                    value='300-500'
                    checked={priceRange === '300-500'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>300.000đ - 500.000đ</span>
                </label>
                <label>
                  <input
                    type='radio'
                    name='price'
                    value='500-700'
                    checked={priceRange === '500-700'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>500.000đ - 700.000đ</span>
                </label>
                <label>
                  <input
                    type='radio'
                    name='price'
                    value='over-700'
                    checked={priceRange === 'over-700'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>Trên 700.000đ</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className='products-content'>
            <div className='products-header'>
              <div className='results-count'>
                Tìm thấy {filteredProducts.length} sản phẩm
              </div>
              <div className='sort-controls'>
                <label>Sắp xếp theo:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value='default'>Mặc định</option>
                  <option value='price-asc'>Giá tăng dần</option>
                  <option value='price-desc'>Giá giảm dần</option>
                  <option value='rating'>Đánh giá cao nhất</option>
                  <option value='name'>Tên A-Z</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className='products-grid'>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className='no-products'>
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default FunctionalFoods

