class Server {
    constructor() {
        this.url = null;
        this.type = null;
        this.data = null;
        this.action = null;
    }
    handler(fajax) {
        this.url = fajax.url;
        this.type = fajax.method;
        this.data = fajax.data;
        this.findAction();
        this.handleRequest(fajax);
    }

    findAction() {
        let tempArr = this.url.split('/');
        this.action = tempArr[5];
    }

    handleRequest(fajax) {
        switch (this.type) {
            case "GET":
                this.handleGetRequest(fajax);
                break;
            case "POST":
                console.log("post");
                this.handlePostRequest(fajax);
                break;
            case "PUT":
                this.handlePutRequest(fajax);
                break;
            case "DELETE":
                this.handleDeleteRequest(fajax);
                break;
            default:
                fajax.status = 404;
                return;
        }
    }

    handleGetRequest(fajax) {
        switch (this.action) {
            case "getAllTeamMembers":
                this.getAllTeamMembers(fajax);
                break;
            case "getTeamMemberObj":
                this.getTeamMemberObj(fajax);
                break;
            case "getProject":
                this.getProjectInServer(fajax);
                break;
            default:
                fajax.status = 404;
                return;
        }
    }
    handlePostRequest(fajax) {
        console.log("handlePostRequest")
        switch (this.action) {
            case "signIn":
                this.signIn(fajax);
                break;
            case "createNewProject":
                fajax.responseText = insertProject(JSON.parse(this.data));
                fajax.status = 201;
                break;
            case "logIn":
                this.login(fajax);
                break;
            default:
                fajax.status = 404;
                return;
        }

    }

    handlePutRequest(fajax) {
        switch (this.action) {
            case "updateTeamMemberProjects":
                this.updateTeamMemberProjects(fajax);
                break;
            case "addTaskToProject":
                {
                    this.addTaskToProject(fajax);
                }
                break;
            case "updateTaskInProject":
                this.updateTaskInProject(fajax);
                break;
            default:
                fajax.status = 404;
                return;

        }
    }

    handleDeleteRequest(fajax) {
        switch (this.action) {
            case "removeTaskFromProject":
                this.removeTaskFromProject(fajax);
                break;
            case "removeTeamMemberFromProject":
                this.removeTeamMemberFromProject(fajax);
                break;
            case "deleteProject":
                this.deleteProject(fajax);
                break;
            default:
                fajax.status = 404;
                return;
        }
    }
    getAllTeamMembers(fajax) {
        fajax.responseText = getAllTeamMembers();
        console.log(fajax.responseText);
        if (fajax.responseText) {
            console.log(fajax.responseText);
            fajax.status = 200;
            return;
        }
        fajax.status = 404;
        return;
    }
    getProjectInServer(fajax) {
        let codeStartIndex = fajax.url.indexOf("=") + 1;
        let codeProject = fajax.url.substring(codeStartIndex);
        fajax.responseText = JSON.stringify(getProject(codeProject));
        console.log(fajax.responseText);
        if (fajax.responseText)
            fajax.status = 200;
        else
            fajax.status = 404;
        return;
    }
    login(fajax) {
        console.log("i came to the end server login");
        let teamMembers = JSON.parse(getAllTeamMembers());
        let teamMember = JSON.parse(fajax.data);
        if (teamMembers !== null) {
            for (const member of teamMembers) {
                if (member.email === teamMember.email && member.password === teamMember.password) {
                    fajax.status = 200;
                    return;
                }
            }
        }
        fajax.status = 404;
    }
    signIn(fajax) {
        let data = JSON.parse(fajax.data);
        let email = data.email;
        let teamMemberds = JSON.parse(getAllTeamMembers());
        if (teamMemberds) {
            for (let teamMember of teamMemberds) {
                if (teamMember.email == email) {
                    fajax.status = 409;
                    return;
                }
            }
        }
        setTeamMember(data);
        fajax.status = 201;
        return;
    }
    addTaskToProject(fajax) {
        let task = JSON.parse(fajax.data);
        let tempArr = fajax.url.split('/');
        let projectCode = tempArr[6];
        let project = getProject(projectCode);
        if (project !== null) {
            project.addTask(task);
            setProject(project, projectCode);
            fajax.status = 200;
        } else
            fajax.status = 404;
    }
    updateTaskInProject(fajax) {
        let tempArr = fajax.url.split('/');
        let projectCode = tempArr[6];
        let task = JSON.parse(fajax.data);
        let project = getProject(projectCode);
        if (project !== null) {
            let tasks = project.tasks;
            let index = tasks.findIndex(t => t.code === task.code);
            if (index !== -1) {
                tasks[index] = task;
                setProject(project, projectCode);
                fajax.status = 200;
                return;
            } else {
                fajax.status = 404;
                return;
            }
        } else {
            fajax.status = 404;
            return;
        }
    }
    removeTaskFromProject(fajax) {
        debugger;
        let tempArr = fajax.url.split('/');
        let projectCode = tempArr[6];
        let taskCode = tempArr[8];
        const project = getProject(projectCode);
        if (project) {
            const taskIndex = project.tasks.findIndex(task => task.code == taskCode);
            if (taskIndex != -1) {
                project.tasks.splice(taskIndex, 1);
                console.log(project);
                setProject(project, projectCode);
                fajax.status = 200;; // Task removed successfully
                return;
            }
        }
        fajax.status = 404; // Task not found or project doesn't exist
        return;
    }
    getTeamMemberObj(fajax) {
        let emailStartIndex = this.url.indexOf("=") + 1;
        let email = this.url.substring(emailStartIndex);
        try {
            let teamMembers = JSON.parse(getAllTeamMembers()); // assuming this function returns an array of objects
            let foundMember = teamMembers.find(member => member.email === email);
            if (foundMember) {
                fajax.responseText = JSON.stringify(foundMember);
            }
            else {
                throw "error";
            }
            fajax.status = 200;
        }
        catch (e) {
            fajax.status = 404;
        }
        return;
    }
    removeTeamMemberFromProject(fajax) {
        debugger;
        let tempArr = this.url.split('/');
        let projectCode = tempArr[6];
        let email = tempArr[8];
        let isRemoved = removeTeamMemberFromProject(email, projectCode);
        if (isRemoved) {
            removeProjectFromMember(email, projectCode);
            fajax.status = 200;
        }
        else
            fajax.status = 404;
        return;
    }
    deleteProject(fajax) {
        let tempArrOfDeleteProject = this.url.split('/');
        let projectCodeOfDeleteProject = tempArrOfDeleteProject[6];
        let isDeleted = deleteProject(projectCodeOfDeleteProject);
        if (isDeleted)
            fajax.status = 200;
        else
            fajax.status = 404;
    }
    updateTeamMemberProjects(fajax) {
        const data = JSON.parse(this.data);
        let projectObj = { "url": data.url, "type": data.type };
        const success = updateTeamMemberProjects(projectObj, data.email);
        if (success)
            fajax.status = 200;
        else
            fajax.status = 404;
        return;
    }
}