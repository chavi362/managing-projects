
function displayThisProject(projectCode, project, role) {
  event.preventDefault();
  sessionStorage.setItem("projectCode", projectCode);
  sessionStorage.setItem("projectName", project.name);
  sessionStorage.setItem("projectDescription", project.description);
  sessionStorage.setItem("teamMembers", JSON.stringify(project.teamMembers));
  sessionStorage.setItem("tasks", JSON.stringify(project.tasks));
  sessionStorage.setItem("teamMemberRole", "role");
  window.location.hash = "project-display";
}
function findProjectCode(url) {
  let strUrl = url.split('/');
  let projectCode = strUrl[6];
  projectCode = projectCode.split('=');
  return projectCode[1];
}
function displayProjectInTable(url, projectDetails, status, progress, role) {
  let projectCode = findProjectCode(url);
  let table = document.querySelector('table');
  let row = table.insertRow();
  row.setAttribute('data-project-code', projectCode);
  let nameCell = row.insertCell();
  let progressCell = row.insertCell();
  let statusCell = row.insertCell();
  let deadlineCell = row.insertCell();
  let enterCell = row.insertCell();
  let removeCell = row.insertCell();
  let removeProjectButton = document.createElement("button");
  removeProjectButton.classList.add("table-button");
  removeProjectButton.textContent = "Remove";
  removeProjectButton.classList.add("remove-project");
  removeProjectButton.dataset.projectCode = projectCode;
  removeCell.append(removeProjectButton);
  nameCell.textContent = projectDetails.name;
  progressCell.classList.add('progress-cell');
  progressCell.innerHTML = `<div class="progress-bar" style="width: ${progress}%; background-color: ${status === 'Completed' ? '#00ff00' : status === 'In Progress' ? '#ffa500' : 'rgb(83, 78, 78)'};">${Math.round(progress)}%</div>`;
  if (progress == 0) {
    progressCell.innerHTML = '<div class="progress-bar" style="width: 100%; background-color: rgb(83, 78, 78);">0%</div>';
  }
  statusCell.textContent = status;
  deadlineCell.classList.add('deadline-cell');
  deadlineCell.textContent = projectDetails.deadline;
  enterCell.innerHTML = '<a href="#display-project">Enter</a>';
  enterCell.classList.add("table-button");
  enterCell.addEventListener("click", () => {
    displayThisProject(projectCode, projectDetails, role);
  });
  if (role == "manager") {
    removeProjectButton.addEventListener("click", removeProject);
  }
  else {
    removeProjectButton.addEventListener("click", () => { alert('you are not a manager') });
  }
}
function calcForDisplayOneProject(project) {
  let fRequestProject = new FXMLHttpRequest();
  let url = project.url;
  fRequestProject.open('GET', url);
  fRequestProject.onload = function () {
    if (fRequestProject.status === 404) {
      alert("Sorry, there is a problem: one of the team member's projects doesn't exist!");
    }
    else {
      let projectDetails = JSON.parse(fRequestProject.responseText);
      let totalTasks = projectDetails.tasks.length;
      let completedTasks = 0;
      let inProgressTasks = 0;
      let notStartedTasks = 0;
      let totalStatus = 0;
      projectDetails.tasks.forEach(task => {
        if (task.status === 'completed') {
          completedTasks++;
          totalStatus += 100;
        }
        else if (task.status === 'in progress') {
          inProgressTasks++;
          totalStatus += 50;
        }
        else {
          notStartedTasks++;
        }
      });
      let status = '';
      if (completedTasks === totalTasks) {
        status = 'Completed';
      }
      else if (notStartedTasks === totalTasks) {
        status = 'Not Started';
      }
      else {
        status = 'In Progress';
      }
      let progress = totalTasks > 0 ? totalStatus / (totalTasks * 100) * 100 : 0;
      displayProjectInTable(url, projectDetails, status, progress, project.type);
    }
  }
  fRequestProject.send();
}
function getAllMyProjects() {
  const email = sessionStorage.getItem("CurrentTeamMember");
  const fRequest = new FXMLHttpRequest();
  let url = `https://projectHub.com/api/teamMember/getTeamMemberObj/?email=${(email)}`;
  fRequest.open('GET', url);
  fRequest.setRequestHeader('Content-Type', 'application/json');
  fRequest.onload = function () {
    if (fRequest.status === 404) {
      alert("Sorry, you don't exist");
    }
    if (fRequest.status >= 200 && fRequest.status <= 299) {
      let teamMember = JSON.parse(fRequest.responseText);
      teamMember.myProjects.forEach(project => {
        calcForDisplayOneProject(project);
      });
    }
  }
  fRequest.send();
}
function removeProject(event) {
  event.preventDefault();
  const projectCode = event.target.dataset.projectCode;
  console.log(projectCode);
  const fRequest = new FXMLHttpRequest();
  fRequest.setRequestHeader('Content-Type', 'application/json');
  let url = `https://projectHub.com/api/project/deleteProject/${projectCode}`;
  fRequest.open('DELETE', url);
  fRequest.onload = function () {
    if (fRequest.status === 404) {
      alert("projecr not found. Unable to delete.");
    } else if (fRequest.status === 200) {
      alert("project successfully deleted.");
      const tr = document.querySelector(`[data-project-code="${projectCode}"]`);
      tr.remove();
    } else {
      alert("An error occurred while deleting the project.");
    }
  }
  fRequest.send();
}
getAllMyProjects();