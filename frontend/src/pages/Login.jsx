import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserService from "../api/UserService"
import { UserContext } from "../context"

const Login = () => {
    const [Login, setLogin] = useState('')
    const [Password, setPassword] = useState('')
    const [Error, setError] = useState()
    const navigate = useNavigate()
    const [User, setUser] = useContext(UserContext)

    const loginHandler = async (event) => {
        event.preventDefault()

        const response = await UserService.Login(Login, Password)
        if(response.error != null){
            setError(response.error)
        }
        else{
            setError('')
            setUser(response)
            navigate('/')
        }
    }

    const registerHandler = async (event) => {
        event.preventDefault()

        const response = await UserService.Register(Login, Password)
        if(response.error != null){
            setError(response.error)
        }
        else{
            setError('')
            setUser(response)
            navigate('/')
        }
    }

    return (
    <div className="page-login">
        <h1 className="ui center aligned huge header">ToDo App</h1>
        <div className="ui centered grid container">
            <div className="nine wide column">
            <div className="ui fluid card">
                <div className="content">
                <form className="ui form" >
                <div className="field">
                    <label>Login</label>
                    <input type="text" name="login" placeholder="Login" value={Login} onChange={(event) => setLogin(event.target.value)}/>
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" value={Password} onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <button onClick={loginHandler} formAction="/login" formMethod="POST" id="but_login" className="ui primary labeled icon button" type="submit">
                    <i className="unlock alternate icon"></i>
                    Login
                </button>
                <button onClick={registerHandler} formAction="/register" formMethod="POST" id="but_create_acc" className="ui primary labeled icon button" type="submit">
                    <i className="pencil alternate icon"></i>
                    Create an account
                </button>
                <p className="ui header">
                        {Error}
                </p>
                </form>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}
export default Login