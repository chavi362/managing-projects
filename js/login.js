
function handleLogin(event) {
  console.log("handle login");
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const teamMember = new TeamMember(null, email, password);
  const fRequest = new FXMLHttpRequest();
  let url = "https://projectHub.com/api/teamMember/logIn";
  fRequest.open('POST', url);
  fRequest.setRequestHeader('Content-Type', 'application/json');
  fRequest.onload = function () {
    if (fRequest.status == "404") {
      alert("sorry, you doesn't exist");
    } else {
      alert("login");
      sessionStorage.setItem('CurrentTeamMember',email);
      location.hash = "get-started";
    }
  }
 
  fRequest.send(JSON.stringify(teamMember));
}
function initLogin() {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", handleLogin);
}
initLogin();
