import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TestSearch = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('=== TEST SEARCH ===')
    console.log('Query:', query)
    console.log('Navigating to:', `/tim-kiem?q=${encodeURIComponent(query)}`)
    navigate(`/tim-kiem?q=${encodeURIComponent(query)}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term"
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Search
        </button>
      </form>
      <p>Current query: {query}</p>
    </div>
  )
}

export default TestSearch
