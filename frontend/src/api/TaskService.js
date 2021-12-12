import axios from 'axios'

class TaskService {
    static async Delete(task) {
        const response = await axios.post('http://localhost:5000/delete-task', {id:task.id}, {withCredentials:true})
        .then((response) => response.status)
        .catch((error) => error.response.status)
        return await response
    }

    static async Change(task) {
        const response = await axios.post('http://localhost:5000/update-status', {id:task.id, status:task.status}, {withCredentials:true})
        .then((response) => response.status)
        .catch((error) => error.response.status)
        return await response
    }

    static async GetAll() {
        const response = await axios.get('http://localhost:5000/get-all', {withCredentials:true})
        .then((response) => response.data)
        .catch((error) => error.response.status)
        return await response
    }

    static async AddItem(task) {
        const response = await axios.post('http://localhost:5000/add_item', {title:task.title, description:task.description}, {withCredentials:true})
        .then((response) => response.status)
        .catch((error) => error.response.status)
        return await response
    }

    static async ViewItem(id) {
        const response = await axios.get(`http://localhost:5000/view_item/${id}`, {withCredentials:true})
        .then((response) => response.data)
        .catch((error) => error.response.status)
        return await response
    }
}
export default TaskService