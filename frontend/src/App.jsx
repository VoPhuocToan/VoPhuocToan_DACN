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
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchResults from './pages/SearchResults'
import OAuthCallback from './pages/OAuthCallback'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import TermsOfUse from './pages/TermsOfUse'
import ShoppingGuide from './pages/ShoppingGuide'
import ReturnPolicy from './pages/ReturnPolicy'
import FAQ from './pages/FAQ'
import './App.css'
import { AdminRoute, AdminLayout, AdminDashboard, AdminProductList, AdminProductForm, AdminCategoryList, AdminOrderList } from './admin'

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
              <Route path='/tim-kiem' element={<SearchResults />} />
              <Route path='/lien-he' element={<Contact />} />
              <Route path='/dieu-khoan-su-dung' element={<TermsOfUse />} />
              <Route path='/huong-dan-mua-hang' element={<ShoppingGuide />} />
              <Route path='/chinh-sach-doi-tra' element={<ReturnPolicy />} />
              <Route path='/cau-hoi-thuong-gap' element={<FAQ />} />
              <Route path='/gio-hang' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/dang-nhap' element={<Login />} />
              <Route path='/auth/success' element={<OAuthCallback />} />
              <Route path='/dang-ky' element={<Register />} />
              
              {/* Payment Routes */}
              <Route path='/payment/success' element={<PaymentSuccess />} />
              <Route path='/payment/cancel' element={<PaymentCancel />} />
              
              {/* User Account Routes */}
              <Route path='/tai-khoan' element={<Profile />} />
              <Route path='/don-hang' element={<Orders />} />
              <Route path='/yeu-thich' element={<Favorites />} />

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
                <Route path='orders' element={<AdminOrderList />} />
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