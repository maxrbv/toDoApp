function change() {
    const status = event.target.checked
    fetch('/update-status', {
        method: 'POST',
        body: JSON.stringify({
            "id": event.target.parentElement.dataset.id,
            "status": status
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status == 200)
            return response.json();
    })
    .then(json => {
        console.log(json)
    })
}

function delete_task() {
    let task_element = event.target.parentElement;
    fetch('/delete-task', {
        method: "post",
        body: JSON.stringify({"id": task_element.dataset.id}),
        headers: {"Content-Type": "application/json"}
    })
     .then(response => {
        if (response.status == 200) {
            task_element.remove();
        }
     });
}
