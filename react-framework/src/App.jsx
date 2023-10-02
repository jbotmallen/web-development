import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Read from './components/Read'
import Create from './components/Create'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Create />}/>
        <Route path='/' element={ <Read />}/>
      </Routes>
    </Router>
  )
}

export default App