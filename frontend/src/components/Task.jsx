import React from "react";

const Task = ({task, handleDelete, handleChange}) => {
    return (        
    <div className="ui segment" data-id={task.id}>
    <p className="ui header">{task.title}</p>

    <a className="ui grey button" href={`/view/${task.id}`}>View</a>
    <button className="ui red button" onClick={() => handleDelete(task)}>Delete</button>
    <input type="checkbox" onChange={() => handleChange({...task, status:!task.status})} checked={task.status}/>        
    </div>
    )
}
export default Task