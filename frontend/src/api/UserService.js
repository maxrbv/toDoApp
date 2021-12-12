import axios from 'axios'

class UserService {
    static async Login(login, password) {
        const response = await axios.post('http://localhost:5000/login', {login:login, password:password}, {withCredentials:true})
        .then((response) => response.data)
        .catch((error) => error.response.data)
        return await response
    }

    static async Register(login, password) {
        const response = await axios.post('http://localhost:5000/register', {login:login, password:password}, {withCredentials:true})
        return await response.data
    }

    static async Logout() {
        const response = await axios.get('http://localhost:5000/logout', {withCredentials:true})
        return await response.status
    }
}
export default UserService