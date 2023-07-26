function getTaskById(taskId) {
    const tasks = JSON.parse(sessionStorage.getItem("tasks"));
    return tasks.find(function (task) {
        return task.code == taskId;
    });
}
function removeTeamMember(event) {
    const email = event.target.getAttribute("data-target-email");
    const projectCode = sessionStorage.getItem("projectCode");
    const fRequest = new FXMLHttpRequest();
    fRequest.setRequestHeader('Content-Type', 'application/json');
    let url = `https://projectHub.com/api/project/removeTeamMemberFromProject/${projectCode}/teamMember/${email}`; // Construct the URL with project code and task code
    fRequest.open('DELETE', url);
    fRequest.onload = function () {
        if (fRequest.status === 404) {
            alert("Team Member not found. Unable to delete.");
        } else if (fRequest.status === 200) {
            alert("delete");
            const teamMembers = JSON.parse(sessionStorage.getItem("teamMembers"));
            let teamIndex = teamMembers.findIndex(member => member.email == email);
            if (teamIndex !== -1) {
                teamMembers.splice(teamIndex, 1);
            }
            sessionStorage.setItem('teamMembers', JSON.stringify(teamMembers));
            const li = document.querySelector(`[data-target-email="${email}"]`);
            li.remove();
        } else {
            alert("An error occurred while deleting the team member.");
        }
    }
    fRequest.send();

}
function putUpdatedTaskInSessionStorage(task, taskId) {
    let tasks = JSON.parse(sessionStorage.getItem('tasks'));
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].code === taskId) {
            tasks[i] = task;
            break;
        }
    }
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateTask(taskId) {
    const task = getTaskById(taskId);
    const updateTaskNameInput = document.getElementById("update-task-name");
    const updateTaskPrioritySelect = document.getElementById("update-task-priority");
    const updateTaskDeadlineInput = document.getElementById("update-task-deadline");
    const updateTaskCommentsTextarea = document.getElementById("update-task-comments");
    const updateTaskStatusSelect = document.getElementById("update-task-status");
    if (task !== null && updateTaskNameInput !== null && updateTaskPrioritySelect !== null &&
        updateTaskDeadlineInput !== null) {
        task.name = updateTaskNameInput.value;
        task.priority = updateTaskPrioritySelect.value;
        task.deadline = updateTaskDeadlineInput.value;
        task.comments = updateTaskCommentsTextarea.value;
        task.status = updateTaskStatusSelect.value;
        const xhr = new FXMLHttpRequest();
        const projectCode = sessionStorage.getItem("projectCode");
        xhr.open("PUT", `https://projectHub.com/api/tasks/updateTaskInProject/${projectCode}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                const trElements = document.querySelectorAll('.task-row');
                const tr = Array.from(trElements).find((el) => el.dataset.taskId == taskId);
                console.log(tr);
                const nameTd = tr.querySelector("td:nth-child(1)");
                nameTd.textContent = task.name;
                const priorityTd = tr.querySelector("td:nth-child(2)");
                priorityTd.textContent = task.priority;
                const deadlineTd = tr.querySelector("td:nth-child(3)");
                deadlineTd.textContent = task.deadline;
                const commentsTd = tr.querySelector("td:nth-child(4)");
                commentsTd.textContent = task.comments;
                const statusTd = tr.querySelector("td:nth-child(5)");
                statusTd.textContent = task.status;
                const updateTaskContainer = document.getElementById("update-task-container");
                putUpdatedTaskInSessionStorage(task, taskId);
                if (updateTaskContainer !== null) {
                    updateTaskContainer.classList.add("hidden");
                }
            } else {
                alert("there is problem");
                console.error(xhr.statusText);
            }
        };
        xhr.send(JSON.stringify(task));
    }
}
function finishAddingTask() {
    const addTaskNameInput = document.getElementById("add-task-name");
    const addTaskPrioritySelect = document.getElementById("add-task-priority");
    const addTaskDeadlineInput = document.getElementById("add-task-deadline");
    const addTaskCommentsTextarea = document.getElementById("add-task-comments");
    const name = addTaskNameInput.value;
    const priority = addTaskPrioritySelect.value;
    const deadline = addTaskDeadlineInput.value;
    const comments = addTaskCommentsTextarea.value;
    const tasks = JSON.parse(sessionStorage.getItem("tasks"));
    let code = tasks[tasks.length - 1].code + 1;
    let newTask = new Task(code, name, priority, deadline, comments);
    let projectCode = sessionStorage.getItem("projectCode");
    let xhr = new FXMLHttpRequest();
    xhr.setRequestHeader('Content-Type', 'application/json');
    let addUrl = `https://projectHub.com/api/project/addTaskToProject/${projectCode}`;
    xhr.open("PUT", addUrl);
    xhr.onload = function () {
        if (xhr.status === 404) {
            alert("Project not found. Unable to add.");
        } else if (xhr.status === 200) {
            alert("added");
            const addTaskContainer = document.getElementById("add-task-container");
            if (addTaskContainer !== null) {
                addTaskContainer.classList.add("hidden");
            }
            const tasksContainer = document.getElementById("tasks-container");
            displayOneTask(newTask, tasksContainer);
        }
        else {
            alert("sorry, there is a problem")
        }
    }
    xhr.send(JSON.stringify(newTask));
}

function addTask() {
    const addTaskContainer = document.getElementById("add-task-container");
    if (addTaskContainer !== null) {
        addTaskContainer.classList.remove("hidden");
        const addTaskNameInput = document.getElementById("add-task-name");
        if (addTaskNameInput !== null) {
            addTaskNameInput.value = "";
        }
        const addTaskPrioritySelect = document.getElementById("add-task-priority");
        if (addTaskPrioritySelect !== null) {
            addTaskPrioritySelect.value = "Normal";
        }
        const addTaskDeadlineInput = document.getElementById("add-task-deadline");
        if (addTaskDeadlineInput !== null) {
            addTaskDeadlineInput.value = "";
        }
        const addTaskCommentsTextarea = document.getElementById("add-task-comments");
        if (addTaskCommentsTextarea !== null) {
            addTaskCommentsTextarea.value = "";
        }
        const finishAddingTaskBtn = document.getElementById("submit-add-task-button");
        if (finishAddingTaskBtn !== null) {
            finishAddingTaskBtn.addEventListener("click", finishAddingTask)
        }
        const cancelAddTaskButton = document.getElementById("cancel-add-task-button");
        if (cancelAddTaskButton !== null) {
            cancelAddTaskButton.addEventListener("click", function () {
                addTaskContainer.classList.add("hidden");
            });
        }
    }
}

function removeTask(event) {
    event.preventDefault();
    const taskCode = event.target.dataset.taskId;
    const projectCode = sessionStorage.getItem("projectCode");
    const fRequest = new FXMLHttpRequest();
    fRequest.setRequestHeader('Content-Type', 'application/json');
    let url = `https://projectHub.com/api/project/removeTaskFromProject/${projectCode}/task/${taskCode}`; // Construct the URL with project code and task code
    fRequest.open('DELETE', url);
    fRequest.onload = function () {
        if (fRequest.status == 404) {
            alert("Task not found. Unable to delete.");
        } else if (fRequest.status == 200) {
            let tasks = JSON.parse(sessionStorage.getItem('tasks'));
            // Find the index of the task with the given code
            let taskIndex = tasks.findIndex(task => task.code == taskCode);
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
            }
            // Store the updated tasks back in session storage
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
            const tr = document.querySelector(`[data-task-id="${taskCode}"]`);
            tr.remove();
        } else {
            alert("An error occurred while deleting the task.");
        }
    }
    fRequest.send();
}
function editTask(event) {
    const taskCode = event.target.dataset.taskId;
    const task = getTaskById(taskCode);
    if (task !== null) {
        const updateTaskContainer = document.getElementById("update-task-container");
        if (updateTaskContainer !== null) {
            updateTaskContainer.classList.remove("hidden");
            const updateTaskNameInput = document.getElementById("update-task-name");
            updateTaskNameInput.value = task.name;
            const updateTaskPrioritySelect = document.getElementById("update-task-priority");
            updateTaskPrioritySelect.value = task.priority;
            const updateTaskStatusSelect = document.getElementById("update-task-status");
            updateTaskStatusSelect.value = task.status;
            const updateTaskDeadlineInput = document.getElementById("update-task-deadline");
            updateTaskDeadlineInput.value = task.deadline;
            const updateTaskCommentsTextarea = document.getElementById("update-task-comments");
            updateTaskCommentsTextarea.value = task.comments;
            const updateTaskButton = document.getElementById("update-task-button");
            if (updateTaskButton !== null) {
                updateTaskButton.addEventListener("click", function () {
                    updateTask(taskCode);
                });
            }
            const cancelUpdateTaskButton = document.getElementById("cancel-update-task-button");
            if (cancelUpdateTaskButton !== null) {
                cancelUpdateTaskButton.addEventListener("click", function () {
                    updateTaskContainer.classList.add("hidden");
                });
            }
        }
    }
}
function displayOneTask(task, tasksContainer) {
    const tr = document.createElement("tr");
    tr.classList.add("task-row");
    tr.dataset.taskId = task.code;
    const nameTd = document.createElement('td');
    nameTd.textContent = task.name;
    tr.append(nameTd);
    const priorityTd = document.createElement('td');
    priorityTd.textContent = task.priority;
    tr.append(priorityTd);
    const deadlineTd = document.createElement('td');
    deadlineTd.textContent = task.deadline;
    tr.append(deadlineTd);
    const commentsTd = document.createElement('td');
    commentsTd.textContent = task.comments;
    tr.append(commentsTd);
    const statusTd = document.createElement('td');
    statusTd.textContent = task.status;
    tr.append(statusTd);
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-task-button');
    removeButton.dataset.taskId = task.code;
    removeButton.textContent = 'Remove';
    removeButton.addEventListener("click", removeTask);
    const editButton = document.createElement('button');
    editButton.classList.add('edit-task-button');
    editButton.dataset.taskId = task.code;
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editTask);
    const buttonsTd = document.createElement('td');
    buttonsTd.append(removeButton, editButton);
    tr.append(buttonsTd);
    tasksContainer.append(tr);
}
function displayTasks() {
    const tasks = JSON.parse(sessionStorage.getItem("tasks"));
    const tasksContainer = document.getElementById("tasks-container");
    if (tasksContainer !== null) {
        tasksContainer.innerHTML = "";
        for (let task of tasks) {
            displayOneTask(task, tasksContainer);
        }
    }
}
function displayTeamMembers() {
    const teamMembers = JSON.parse(sessionStorage.getItem("teamMembers"));
    const teamMembersContainer = document.getElementById("team-members-container");
    const teamMemberRole = sessionStorage.getItem("teamMemberRole");
    if (teamMembersContainer !== null) {
        teamMembersContainer.innerHTML = "";
        for (let teamMember of teamMembers) {
            const email = teamMember.email;
            const type = teamMember.type;
            const li = document.createElement("li");
            li.setAttribute("data-target-email", email);
            li.innerHTML = `${email} ( ${type} )`;
            if (teamMemberRole === "manager") {
                const removeButton = document.createElement("button");
                removeButton.innerHTML = "Remove";
                removeButton.setAttribute("data-target-email", email);
                removeButton.addEventListener("click", removeTeamMember);
                li.appendChild(removeButton);
            }
            teamMembersContainer.append(li);
        }
    }
}
function initAllProjectDetails() {
    const projectName = sessionStorage.getItem("projectName");
    const projectDescription = sessionStorage.getItem("projectDescription");
    const projectNameElement = document.getElementById("project-name");
    if (projectNameElement !== null) {
        projectNameElement.textContent = projectName;
    }
    const projectDescriptionElement = document.getElementById("project-description");
    if (projectDescriptionElement !== null) {
        projectDescriptionElement.textContent = projectDescription;
    }
    displayTasks();
    displayTeamMembers();
    const addTaskButton = document.getElementById("add-task-button");
    addTaskButton.addEventListener("click", addTask);
}
initAllProjectDetails();
