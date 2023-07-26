
function setTeamMember(newTeamMember) {
    console.log("set team member");
    let teamMembers = localStorage.getItem("teamMembersArray");
    if (!teamMembers) {
        teamMembers = [];
    }
    else
        teamMembers = JSON.parse(teamMembers);
    teamMembers.push(newTeamMember);
    localStorage.setItem("teamMembersArray", JSON.stringify(teamMembers));
}
function getAllTeamMembers() {
    return localStorage.getItem("teamMembersArray");
}

// Generate unique code for new project
function buildProjectCode() {
    if (!localStorage.getItem('projectCode')) {
        localStorage.setItem('projectCode', 0);
        return 'P0';
    } else {
        let tempCode = parseInt(localStorage.getItem('projectCode'));
        tempCode++;
        localStorage.setItem('projectCode', tempCode);
        return `P${tempCode}`;
    }
}
function insertProject(project) {
    const projectCode = buildProjectCode();
    localStorage.setItem(projectCode, JSON.stringify(project));
    return projectCode;
}
// Get project by code from local storage
function getProject(code) {
    debugger;
    const projectData = JSON.parse(localStorage.getItem(code));
    if (projectData !== null) {
        const { name, description, teamMembers, tasks, deadline } = projectData;
        return new Project(name, description, teamMembers, tasks, deadline);
    } else {
        return null;
    }
}
function updateTeamMemberProjects(projectObj, email) {
    let teamMembers = JSON.parse(localStorage.getItem("teamMembersArray"));
    for (let member of teamMembers) {
        if (member.email === email) {
            member.myProjects.push(projectObj);
            localStorage.setItem("teamMembersArray", JSON.stringify(teamMembers));
            return true;
        }
    }
    return false;
}
function setProject(project, projectCode) {
    console.log(projectCode);
    localStorage.setItem(projectCode, JSON.stringify(project));
}
function removeProjectFromMember(email, projectCode) {
    let teamMembers = JSON.parse(localStorage.getItem("teamMembersArray"));
    let memberIndex = teamMembers.findIndex(teamMember => teamMember.email == email);
    let member = teamMembers[memberIndex];
    const projectUrlToDeleteIndex = member.myProjects.findIndex(project => project.url === `https://projectHub.com/api/projects/getProject/?code=${projectCode}`);
    if (projectUrlToDeleteIndex !== -1) {
        member.myProjects.splice(projectUrlToDeleteIndex, 1);
    }
}
function removeTeamMemberFromProject(email, projectCode) {
    const project = getProject(projectCode);
    if (project) {
        const teamMemberIndex = project.teamMembers.findIndex(teamMember => teamMember.email == email);
        if (teamMemberIndex != -1) {
            project.teamMembers.splice(teamMemberIndex, 1);
            console.log(project);
            setProject(project, projectCode);
            return true; // Task removed successfully
        }
    }
    return false; // Task not found or project doesn't exist
}
function getTeamMemberObj(email) {
    let teamMembers = JSON.parse(getAllTeamMembers());
    let foundMember = teamMembers.find(member => member.email === email);
    if (foundMember) {
        return (foundMember);
    }
    else {
        throw "error";
    }
}
function deleteProject(projectCode) {
    const projectToDelete = getProject(projectCode);
    if (projectToDelete) {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembersArray"));
        for (let member of teamMembers) {
            console.log(member);
            const projectUrlToDeleteIndex = member.myProjects.findIndex(project => project.url === `https://projectHub.com/api/projects/getProject/?code=${projectCode}`);
            console.log(projectUrlToDeleteIndex);
            if (projectUrlToDeleteIndex !== -1) {
                member.myProjects.splice(projectUrlToDeleteIndex, 1);
            }
        }
        localStorage.setItem("teamMembersArray", JSON.stringify(teamMembers));
        localStorage.removeItem(projectCode);
        return true;
    }
    return false;
}