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
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  )
}

export default App
