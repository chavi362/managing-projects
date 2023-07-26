
class Project {
  constructor(name, description, teamMembers, tasks, deadline) {
    this.name = name;
    this.description = description;
    this.teamMembers = teamMembers;
    this.tasks = tasks;
    this.deadline = deadline;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  createProject() {
    let response;
    console.log(`Creating project: ${this.name}`);
    const xhr = new FXMLHttpRequest();
    xhr.open('POST', 'https://projectHub.com/api/projects/createNewProject');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 201) {
        console.log('Project created successfully');
        this.teamMembers.forEach(teamMember => {
          console.log(teamMember);
          let fRequest = new FXMLHttpRequest();
          fRequest.open('PUT', "https://projectHub.com/api/teamMember/updateTeamMemberProjects");
          fRequest.onload = function () {
            if (fRequest.status === "404") {
              alert("sorry, there is a problem: one of the team members doesn't exist!");
            }
          }
          response = xhr.responseText;
          let data = { "email": teamMember.email, "url": `https://projectHub.com/api/projects/getProject/?code=${xhr.responseText}`, "type": teamMember.type }
          console.log(data);
          fRequest.send(JSON.stringify(data));
          updateCurrentProjectInSesionStorage(xhr.responseText, this);
        });
      }
    }
    xhr.send(JSON.stringify(this));
  }
}
