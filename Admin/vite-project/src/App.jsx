import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import ContactList from './pages/ContactList'
import ContactDetail from './pages/ContactDetail'
import OrderList from './pages/OrderList'
import PromotionList from './pages/PromotionList'
import PromotionForm from './pages/PromotionForm'
import CommentList from './pages/CommentList'
import UserList from './pages/UserList'
import Revenue from './pages/Revenue'
import './styles/index.css'

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='products' element={<ProductList />} />
            <Route path='products/new' element={<ProductForm />} />
            <Route path='products/:id' element={<ProductForm />} />
            <Route path='categories' element={<Categories />} />
            <Route path='contact' element={<ContactList />} />
            <Route path='contact/:id' element={<ContactDetail />} />
            <Route path='orders' element={<OrderList />} />
            <Route path='revenue' element={<Revenue />} />
            <Route path='promotions' element={<PromotionList />} />
            <Route path='promotions/new' element={<PromotionForm />} />
            <Route path='promotions/edit/:id' element={<PromotionForm />} />
            <Route path='comments' element={<CommentList />} />
            <Route path='users' element={<UserList />} />
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  )
}

export default App
