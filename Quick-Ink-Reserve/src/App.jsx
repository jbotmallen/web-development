import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './components/Login'
import SignUp from './components/SignUp'
import AdminHome from './components/admin/Home'
import Profile from './components/Profile'
import Edit from './components/admin/profileComponents/Edit'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={ <Login />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/' element={ <AdminHome />}/>
        <Route path='/profile' element={ <Profile />}/>
        <Route path='/edit' element={ <Edit />}/>
      </Routes>
    </Router>
  )
}

export default App
