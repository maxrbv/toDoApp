import React, { useState } from "react"
import TaskService from "../api/TaskService"
import { useNavigate } from "react-router-dom"

const AddItem = () => {
    const [Description, setDescription] = useState()
    const [Title, setTitle] = useState()
    const navigate = useNavigate()
    const handleAddItem = async (event) => {
        event.preventDefault()
        const response = await TaskService.AddItem({
            title:Title,
            description:Description
        })
        navigate('/')
    }

    return (
        <div className="ui container">
        <h1 className="ui center aligned huge header">ToDo App</h1>
        <form className="ui fluid form" action="/add_item" method="post">
            <div className="filed">
                <div className="ui pointing below label">ToDo Title</div>
                <input value={Title} onChange={(event) => setTitle(event.target.value)} type="text" name="title" placeholder="Enter Todo Title" required/>
            </div>
            <div className="ui divider"></div>
            <div className="filed">
                <div className="ui pointing below label">ToDo Description</div>
                <textarea value={Description} onChange={(event) => setDescription(event.target.value)} type="text" id="description" name="description" wrap="hard" rows="10"></textarea>
            </div>
            <button onClick={(event) => handleAddItem(event)}  className="ui blue button">Add</button>
        </form>
        <a className="ui grey button" href="/">Back</a>
    </div>  
    )
}
export default AddItem