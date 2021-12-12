import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { UserContext } from "../context"
import AddItem from "../pages/AddItem"
import Home from "../pages/Home"
import Item from "../pages/Item"
import Login from "../pages/Login"


const AppRouter = () => {
    const [User, _] = useContext(UserContext)
    const isAuth = () => {
        return User.id != null && User.login != null
    }
    return (
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={isAuth()? <Navigate to='/'/> : <Login/>}/>
            <Route path='/add' element={<AddItem/>}/>
            <Route path='/view/:id' element={<Item/>}/>
            <Route path='/' element={isAuth()? <Home/> : <Navigate to='/login'/>}/>
        </Routes>
    </BrowserRouter>
    )
}
export default AppRouter
