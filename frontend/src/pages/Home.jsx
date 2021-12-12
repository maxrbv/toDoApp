import React, { useContext, useState, useCallback } from "react"
import { UserContext } from "../context"
import { useAsync } from "react-use"
import TaskService from "../api/TaskService"
import UserService from "../api/UserService"
import Task from "../components/Task"
import { useNavigate } from "react-router"

const Home = () => {
    const [User, _] = useContext(UserContext)
    const [Tasks, setTasks] = useState()
    const navigate = useNavigate()

    const handleDelete = useCallback (async (task) => {
       await TaskService.Delete(task)
       setTasks(Tasks.filter(taskItem => taskItem.id != task.id))
    }, [Tasks])

    const handleChange = useCallback (async (task) => {
        await TaskService.Change(task)
        setTasks([...Tasks.filter(taskItem => taskItem.id != task.id), task])
     }, [Tasks])

    const State = useAsync(async() => {
        const response = await TaskService.GetAll()
        if (response != 401) setTasks(response)
        else setTasks([])
    }, [])

    const handleLogout = async () => {
        await UserService.Logout()
        navigate('/login')
        window.location.reload()
     }

    return (
        <div className="ui container">
        <h1 className="ui center aligned huge header">ToDo App</h1>

        <div>
            <p className="ui header">User name: {User.login}</p>
                <div className="field">
                    <a className="ui red button" onClick={async () => await handleLogout()}>LogOut</a>
                </div>
        </div>

        <a className="ui blue button" href="/add">Add Task</a>

        {State.loading? <div>Loading...</div> : 
        Tasks.map((task) => <Task task={task} handleDelete={handleDelete} handleChange={handleChange}/>)
        }
    </div>
    )
}
export default Home