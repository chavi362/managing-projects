
let teamMembers;
const selectedList = document.querySelector('.selected-list');
function addAddEventListeners() {
    const inputField = document.querySelector('.chosen-value');
    const dropdown = document.querySelector('.value-list');
    dropdown.addEventListener("click", updateSelectedEmail);
    inputField.addEventListener('input', handleInput);
    inputField.addEventListener('focus', handleInputFieldFocus);
    inputField.addEventListener('blur', handleInputFieldBlur);
    const addButton = document.querySelector('.add-button');
    addButton.addEventListener("click", handleAddTeamMember);
    document.getElementById('add-task').addEventListener('click', addTask);
}
addAddEventListeners();
function updateSelectedEmail(event) {
    const inputField = document.querySelector('.chosen-value');
    const focusedElement = event.target;
    const email = focusedElement.dataset.email;
    inputField.value = email;
}
function createAddButton(selected, selectedTeamMembers) {
    const inputField = document.querySelector('.chosen-value');
    const addButton = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.dataset.email = selected.email;
        li.classList.add('team-member');
        const emailSpan = document.createElement('span');
        emailSpan.classList.add('email');
        emailSpan.textContent = selected.email;
        li.append(emailSpan);
        const typeSpan = document.createElement('span');
        typeSpan.classList.add('type');
        const typeButton = document.querySelector(`[data-target-email="${selected.email}"]`);
        typeSpan.textContent = typeButton.textContent;
        li.append(typeSpan);
        const removeButton = document.createElement('span');
        removeButton.classList.add('remove');
        removeButton.textContent = 'x';
        removeButton.addEventListener('click', () => {
            li.remove();
            const option = document.createElement('li');
            option.textContent = selected.email;
            option.dataset.email = selected.email;
            dropdown.append(option);
        });
        li.append(removeButton);
        selectedList.append(li);
        div.remove();
        inputField.value = '';
        const dropdown = document.querySelector('.value-list');
        const option = dropdown.querySelector(`[data-email="${selected.email}"]`);
        option.remove();
    });
    return addButton;
}
// Function to handle adding a team member
function handleAddTeamMember() {
    const inputField = document.querySelector('.chosen-value');
    const value = inputField.value;
    const selected = teamMembers.find((member) => member.email === value);
    if (selected) {
        const selectedTeamMembers = document.querySelectorAll('.selected-item');
        div = createSelectedItemDiv(selected, selectedTeamMembers);
        const addButton = createAddButton(selected, selectedTeamMembers);
        div.append(addButton);
        selectedList.append(div);
    }
}
// Function to Initialize Fields for Adding
function initFieldsForAdd() {
    // Fetch team members
    let xhr = new FXMLHttpRequest();
    xhr.open('GET', "https://projectHub.com/api/teamMember/getAllTeamMembers");
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
            teamMembers = JSON.parse(xhr.responseText);
            let currentUser = sessionStorage.getItem("CurrentTeamMember");
            teamMembers = teamMembers.filter(teamMember => teamMember.email != currentUser);
            populateDropdown(teamMembers);
        }
    };
    xhr.send();
}
// Function to populate dropdown with team members
function populateDropdown(teamMembers) {
    const dropdown = document.querySelector('.value-list');
    teamMembers.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.email;
        li.dataset.email = member.email;
        dropdown.append(li);
    });
}

// Function to handle input in the dropdown field
function handleInput() {
    const inputField = document.querySelector('.chosen-value');
    const dropdown = document.querySelector('.value-list');
    dropdown.classList.add('open');
    const inputValue = inputField.value.toLowerCase();
    const dropdownArrayFiltered = teamMembers.filter(member => member.email.toLowerCase().startsWith(inputValue));
    dropdown.textContent = '';
    dropdownArrayFiltered.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.email;
        li.dataset.email = member.email;
        li.dataset.type = member.type;
        dropdown.append(li);
    });
}
// Function to handle focus on the dropdown field
function handleInputFieldFocus() {
    const inputField = document.querySelector('.chosen-value');
    inputField.classList.add('open');
}
// Function to handle blur on the dropdown field
function handleInputFieldBlur() {
    const inputField = document.querySelector('.chosen-value');
    // const dropdown = document.querySelector('.value-list');
    inputField.classList.remove('open');
}
function changeSelectedType(event) {
    let option = event.target.dataset.value;
    let email = event.target.dataset.targetEmail;
    const typeButtons = document.querySelectorAll('.type-button');
    const targetButton = Array.from(typeButtons).find(button => button.dataset.targetEmail === email);
    if (targetButton) {
        targetButton.textContent = option;
        targetButton.dataset.value = option;
    }
    event.target.classList.add('hidden');
}
function createTypeDropdown(selected) {
    const typeDropdown = document.createElement('ul');
    typeDropdown.classList.add('type-dropdown');
    typeDropdown.classList.add('hidden');
    const typeOptions = [
        { value: 'manager', label: 'Manager' },
        { value: 'regular', label: 'Regular' }
    ];
    typeOptions.forEach((option) => {
        const typeOption = document.createElement('li');
        typeOption.setAttribute('data-target-email', selected.email);
        typeOption.classList.add('type-option');
        typeOption.dataset.value = option.value;
        typeOption.textContent = option.label;
        typeOption.addEventListener('click', changeSelectedType);
        typeDropdown.append(typeOption);
    });
    return typeDropdown;
}
function createSelectedItemDiv(selected) {
    const div = document.createElement('div');
    div.classList.add('selected-item');
    div.dataset.email = selected.email;
    const emailSpan = document.createElement('span');
    emailSpan.classList.add('email');
    emailSpan.textContent = selected.email;
    div.append(emailSpan);
    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown-container');
    const typeButton = document.createElement('button');
    typeButton.classList.add('type-button');
    typeButton.type = "button";
    typeButton.setAttribute('data-target-email', selected.email);
    typeButton.textContent = 'Regular';
    dropdownContainer.append(typeButton);
    const typeDropdown = createTypeDropdown(selected);
    dropdownContainer.append(typeDropdown);
    typeButton.addEventListener('click', () => {
        typeDropdown.classList.toggle('hidden');
    });
    div.append(dropdownContainer);
    return div;
}
// Function to add a new task
function addTask() {
    const tasksContainer = document.getElementById('tasks-container');
    let newTaskContainer = createTaskContainer();
    tasksContainer.append(newTaskContainer);
}
// Function to create a new task container
function createTaskContainer() {
    let newTaskContainer = document.createElement('div');
    newTaskContainer.setAttribute("id", "newTaskContainer");
    newTaskContainer.classList.add('task');
    const taskHeader = createTaskHeader();
    const deadlineInput = createDeadlineInput();
    const commentsInput = createCommentsInput();
    const removeButton = createRemoveButton();
    newTaskContainer.append(taskHeader);
    newTaskContainer.append(deadlineInput);
    newTaskContainer.append(document.createElement('br'));
    newTaskContainer.append(commentsInput);
    newTaskContainer.append(document.createElement('br'));
    newTaskContainer.append(removeButton);
    return newTaskContainer;
}
// Function to create the task header
function createTaskHeader() {
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Task Name';
    nameInput.classList.add('task-name');
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Priority: ';
    const priorityInput = createPriorityInput();
    taskHeader.append(nameInput);
    taskHeader.append(priorityLabel);
    taskHeader.append(priorityInput);
    return taskHeader;
}
// Function to create the priority input field
function createPriorityInput() {
    const priorityInput = document.createElement('select');
    priorityInput.classList.add('task-priority');
    const priorityOptions = ['High', 'Normal', 'Low'];
    priorityOptions.forEach((option) => {
        const priorityOption = document.createElement('option');
        priorityOption.value = option;
        priorityOption.textContent = option;
        priorityInput.append(priorityOption);
    });
    return priorityInput;
}
// Function to create the deadline input field
function createDeadlineInput() {
    const deadlineLabel = document.createElement('label');
    deadlineLabel.textContent = 'Deadline: ';
    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'date';
    deadlineInput.classList.add('task-deadline');
    const deadlineContainer = document.createElement('div');
    deadlineContainer.append(deadlineLabel);
    deadlineContainer.append(deadlineInput);
    return deadlineContainer;
}
// Function to create the comments input field
function createCommentsInput() {
    const commentsLabel = document.createElement('label');
    commentsLabel.textContent = 'Comments:';
    const commentsInput = document.createElement('textarea');
    commentsInput.rows = '3';
    commentsInput.classList.add('task-comments');
    const commentsContainer = document.createElement('div');
    commentsContainer.append(commentsLabel);
    commentsContainer.append(commentsInput);
    return commentsContainer;
}
// Function to create the remove button
function createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.type = "button";
    removeButton.addEventListener('click', () => {
        let newTaskContainer = document.getElementById("newTaskContainer");
        newTaskContainer.remove();
    });
    return removeButton;
}
initFieldsForAdd();