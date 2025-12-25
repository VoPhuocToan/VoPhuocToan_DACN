import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './admin.css'

const AdminLayout = () => {
  return (
    <div className='admin-wrap'>
      <aside className='admin-sidebar'>
        <div className='admin-brand'>
          <h2>HealthyCare Admin</h2>
        </div>
        <nav className='admin-nav'>
          <ul>
            <li><Link to='/admin'>📊 Dashboard</Link></li>
            <li><Link to='/admin/products'>📦 Sản phẩm</Link></li>
            <li><Link to='/admin/products/new'>➕ Thêm sản phẩm</Link></li>
            <li><Link to='/admin/categories'>📁 Danh mục</Link></li>
            <li><Link to='/admin/orders'>🛒 Đơn hàng</Link></li>
            <li><Link to='/admin/promotions'>🎟️ Khuyến mãi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className='admin-main'>
        <div className='admin-container'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
