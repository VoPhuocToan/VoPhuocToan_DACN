import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Chatbox from './components/Chatbox/Chatbox'
import Home from './pages/Home'
import FunctionalFoods from './pages/FunctionalFoods'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import { AdminRoute, AdminLayout, AdminDashboard, AdminProductList, AdminProductForm, AdminCategoryList } from './admin'

const App = () => {
  // Handle back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        document.body.classList.add('scroll-active')
      } else {
        document.body.classList.remove('scroll-active')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className='app'>
          <Navbar />
          <main className='app-main'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/thuc-pham-chuc-nang' element={<FunctionalFoods />} />
              <Route path='/thuc-pham-chuc-nang/:id' element={<ProductDetail />} />
              <Route path='/lien-he' element={<Contact />} />
              <Route path='/gio-hang' element={<Cart />} />
              <Route path='/dang-nhap' element={<Login />} />
              <Route path='/dang-ky' element={<Register />} />

              {/* Admin routes */}
              <Route path='/admin' element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path='products' element={<AdminProductList />} />
                <Route path='products/new' element={<AdminProductForm />} />
                <Route path='products/:id' element={<AdminProductForm />} />
                <Route path='categories' element={<AdminCategoryList />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <Chatbox />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App