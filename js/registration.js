function handleRegistration(event) {
    event.preventDefault();
    const fRequest = new FXMLHttpRequest();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const teamMember = new TeamMember(name, email, password);
    let url = "https://projectHub.com/api/teamMember/signIn";
    fRequest.open('POST', url);
    fRequest.setRequestHeader('Content-Type', 'application/json');
    fRequest.onload = () => {
        if (fRequest.status === 201) {
          alert("Registered successfully!");
          sessionStorage.setItem('CurrentTeamMember', email);
          location.hash = "get-started";
        } else if (fRequest.status === 409) {
          alert("Sorry, this email already exists.");
        } else {
          // Handle other status codes
          alert("sorry there is a problem ")
        }
      };
    fRequest.send(JSON.stringify(teamMember));
}
function initRegistration() {
    const registrationForm = document.getElementById("registration-form");
    registrationForm.addEventListener("submit", handleRegistration);
}
initRegistration();