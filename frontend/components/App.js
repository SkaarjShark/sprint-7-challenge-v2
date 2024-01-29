import React from 'react'
import Home from './Home'
import Form from './Form'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function activeClass(evt) {
  console.log(evt.target.className)
  if (!evt.target.className) {
    evt.target.className = "active"
  }
}

function App() {
  return (
    <div id="app">
        <nav>
          <Link to="/" className="active" aria-current="page" onClick={activeClass}>Home</Link>
          <Link to="/order" className="" onClick={activeClass}>Order</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="order" element={<Form />}/>
        </Routes>
    </div>
  )
}

export default App
