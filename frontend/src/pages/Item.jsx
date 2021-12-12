import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAsync } from "react-use"
import TaskService from "../api/TaskService"

const Item = () => {
    const Params = useParams()
    const [Task, setTask] = useState()
    const navigate = useNavigate()

    const State = useAsync(async() => {
        const response = await TaskService.ViewItem(Params.id)
        if (response != 401) setTask(response)
        else navigate('/login')
    }, [])

    return (
        State.loading ? <div>Loading...</div> :
        <div className="ui container">
            <h1 className="ui center aligned huge header">ToDo App</h1>
            {Task == null ? <div>No Task</div>  : <div>
            <div className="ui segment">
                <p className="ui huge center aligned header">{Task.title}</p>
            </div>
            <div className="ui divider"></div>
            <div className="ui segment">
                <p className="ui small header">Description:<br/>{Task.description}</p>
            </div>
            </div>}
                <a className="ui grey button" href="/">Back</a>
        </div>
    )
}
export default Item