
function getTeamMembersArray() {
  const teamMembers = [];
  teamMembers.push({ email: sessionStorage.getItem('CurrentTeamMember'), type: "manager" });
  const teamMembersList = document.querySelectorAll('#selected-list .team-member');
  teamMembersList.forEach((teamMember) => {
    const email = teamMember.querySelector('.email').textContent;
    const type = teamMember.querySelector('.type').textContent;
    teamMembers.push({ email, type });
  });
  return teamMembers;
}
function getTasksArray(projectDeadline) {
  const tasks = [];
  let taskID = 0;
  const taskInputs = document.querySelectorAll('.task');
  taskInputs.forEach((taskInput) => {
    debugger;
    const name = taskInput.querySelector('.task-name').value;
    const priority = taskInput.querySelector('.task-priority').value;
    const deadline = taskInput.querySelector('.task-deadline').value;
    const comments = taskInput.querySelector('.task-comments').value;
    if (deadline && new Date(deadline) <= new Date() || new Date(deadline)>= new Date(projectDeadline)) {
      throw 'Invalid deadline for task: ' + name;
    } else if (deadline) {
      tasks.push(new Task(taskID, name, priority, deadline, comments));
      taskID++;
    }
  });
  return tasks;
}
function displayError(error) {
  const errorDiv = document.getElementById('create-project-error');
  errorDiv.textContent = error;
  errorDiv.style.display = 'block';
}
function createNewProject(event) {
  debugger;
  event.preventDefault();
  const projectName = document.getElementById('project-name').value;
  const projectDescription = document.getElementById('project-description').value;
  const projectDeadline = document.getElementById('project-deadline').value;
  if (new Date(projectDeadline) < new Date()) {
    displayError('The deadline of the project does not make sense.')
    return;
  }
  let tasks;
  try {
    tasks = getTasksArray(projectDeadline);
  }
  catch (e) {
    displayError(e);
    return;
  }
  let teamMembers = getTeamMembersArray();
  const createProject = () => {
    const projectObject = new Project(projectName, projectDescription, teamMembers, tasks, projectDeadline);
    console.log(projectObject);
    projectObject.createProject();
  };
  createProject();
}
function initFields() {
  document.getElementById('create-project-btn').addEventListener('click', createNewProject);
}
initFields();
function updateCurrentProjectInSesionStorage(projectCode, project) {
  sessionStorage.setItem("projectCode", projectCode);
  sessionStorage.setItem("projectName", project.name);
  sessionStorage.setItem("projectDescription", project.description);
  sessionStorage.setItem("teamMembers", JSON.stringify(project.teamMembers));
  sessionStorage.setItem("tasks", JSON.stringify(project.tasks));
  sessionStorage.setItem("teamMemberRole", "manager");
  window.location.hash = "project-display";
}