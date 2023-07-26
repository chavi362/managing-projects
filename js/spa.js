
window.addEventListener('hashchange', replaceTemplate);
replaceTemplate();
function replaceTemplate() {
    let hash = location.hash.replace('#', '');
    if (hash != "registration" && sessionStorage.getItem('CurrentTeamMember') == null) {
        hash = "login";
    }
    let openTemplate = document.getElementById(hash).content;
    const contentDiv = document.querySelector('#main-content');
    contentDiv.innerHTML="";
    contentDiv.replaceChildren(openTemplate.cloneNode(true));
}