document.addEventListener("DOMContentLoaded", () => {

const activateAddTask = document.getElementById('firstSectionButton')
const darkModeBtn = document.getElementById("darkModeBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const body = document.body;
const header = document.getElementById("header");
const firstSection = document.getElementById("first-section");
const searchArea = document.getElementById("search-area");
const taskList = document.getElementById("taskList");
const popup = document.getElementById("popup");
const addTaskPopup = document.getElementById("addTaskPopup");
const notification = document.getElementById("notification");
const searchIcon = document.getElementById("searchIcon");
const allText = document.querySelectorAll("h1, h2, h3, p, label, span");
const allInputs = document.querySelectorAll("input, textarea");
const filterButtons = document.querySelectorAll(".filter");
const popupLabel = document.querySelectorAll(".popupLabel");

const taskName = document.getElementById("taskName");
const taskDesc = document.getElementById("taskDesc");
const date = document.getElementById("date");
const time = document.getElementById("time");

// 1. change mode
let isDark = false;

darkModeBtn.addEventListener("click", switchMode);

function switchMode(e) {
    e.preventDefault();

    isDark = !isDark;

    if (isDark) {
        applyDarkMode();
    } else {
        applyLightMode();
    }
}

// for dark mode
function applyDarkMode(e) {
    e.preventDefault();
    body.style.backgroundColor = "#1a1919ff";
    body.style.color = "white";
    addTaskPopup.style.backgroundColor = "#1a1919ff";
    darkModeBtn.src = "../assets/light mode.svg";
    notification.src = "../assets/white notification.svg";
    searchIcon.src = "../assets/white search.svg"
    if (allText.style.color === "black") {
        allText.style.color === "white"
    }

    filterButtons.forEach(btn => {
        btn.style.all= "unset";
        btn.style.color = "white";
    });
}

// for light mode
function applyLightMode(e) {
    e.preventDefault();
    body.style.backgroundColor = "white";
    body.style.color = "black";
    darkModeBtn.src = "../assets/Dark mode.svg";
    notification.src = "../assets/Notification.svg";
    searchIcon.src = "../assets/search.svg"

    filterButtons.forEach(btn => {
        btn.style.all= "unset";
        btn.style.color = "black";
    });
}

// 2. activate add task card

activateAddTask.addEventListener('click', displayAddTask)

function displayAddTask (e) {
    e.preventDefault();
    popup.style.display = "flex"
}

popup.addEventListener("click", closeAddTask)
    
function closeAddTask (e) {
    e.preventDefault();
    if (e.target === popup) {
        popup.style.display = "none";
    }

    else {popup.style.display = "flex"}
};


// 3. send stuffs to backend
addTaskPopup.addEventListener('submit', submitTask)

function submitTask (e) {
e.preventDefault();

const nameInput = taskName.value;
const descriptionInput = taskDesc.value;
const dueDateInput= date.value;
const dueTimeInput = time.value;

const convertedDate = new Date(`${dueDateInput}T${dueTimeInput}:00`).toISOString();

const newTaskCreated = {
        task_name: nameInput,
        Description: descriptionInput,
        due_date: dueDateInput,   
        due_time: convertedDate
};

fetch ('https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newTaskCreated)
    
})

.then(res=> res.json())
.then(info => {
    console.log("Task added:", info);   
    renderTask();
    addTaskPopup.reset();  
    popup.style.display = "none";
})

}

// render to UI
function renderTask () {

    fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list")
    .then(function(res){
        return res.json();
    })
    .then(function(data){

        taskList.innerHTML = "";

        data.forEach(function(task) {

            let taskItemContainer = document.createElement("div");
            taskItemContainer.className = "taskItemContainer";

            let checkedTaskDiv = document.createElement("div");
            checkedTaskDiv.className = "checkedTaskDiv";

            let checkedTask = document.createElement("img");
            checkedTask.src = "../assets/unselected.svg";
            checkedTask.className = "checkedTask";

            checkedTaskDiv.appendChild(checkedTask);

            let taskDiv = document.createElement("div");
            taskDiv.className = "taskDiv";


            let taskIdNo = document.createElement("p");
            taskIdNo.textContent = task.id;
            taskIdNo.style.display = "none"
            taskIdNo.className = "taskIdNo";


            let title = document.createElement("h3");
            title.textContent = task.task_name;
            title.className = "taskTitle";

            let desc = document.createElement("p");
            desc.textContent = task.Description;
            desc.className = "descOfTask";

            let date = document.createElement("h5");
            date.textContent = "Due date: " + task.due_date;
            date.className = "dateOfTask";

            
            let editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "editTaskBtn";           

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "deleteTaskBtn";
            

            deleteBtn.addEventListener("click", (e)=> {
                e.preventDefault();
                let getTaskId = taskDiv.querySelector(".taskIdNo").textContent;
                // let grandParentForDel = deleteBtn.parentNode.parentNode; 

                removeFromUi(e);
                delFromBackend(getTaskId);
            })

            let btnDiv = document.createElement("div");
            btnDiv.className = "btnDiv"
            btnDiv.style.display = "flex"

            btnDiv.appendChild(editBtn);
            btnDiv.appendChild(deleteBtn);

            taskDiv.appendChild(title);
            taskDiv.appendChild(desc);
            taskDiv.appendChild(date);
            taskDiv.appendChild(btnDiv);
            // taskDiv.appendChild(editBtn);
            // taskDiv.appendChild(deleteBtn);
            taskDiv.appendChild(taskIdNo);
            

            taskItemContainer.appendChild(checkedTaskDiv);
            taskItemContainer.appendChild(taskDiv);   

            taskList.appendChild(taskItemContainer);

        });

    })
    .catch(function(err){
        console.log("show error:", err);
    });
}

function removeFromUi(e) {
    let grandParent = e.target.parentNode.parentNode;
    grandParent.remove();
}


function delFromBackend(getTaskId) {
    fetch(`https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${getTaskId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Task deleted from backend:", data); 
    })
    .catch(error => {
        console.error("Error deleting task:", error);
    });
}







// change border of filter columns
// having issues, fix later

filterButtons.forEach(button => { 
button.addEventListener('click', filterFunction)
})

function filterFunction (e) {
    e.preventDefault();
    e.target.style.borderColor = "#FF9326";
}

renderTask();

function getAllTask () {

    fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list")
    .then(function(res){
        return res.json();
    })
    .then(function(data){

        taskList.innerHTML = "";

        data.forEach(function(task) {

            let taskItemContainer = document.createElement("div");
            taskItemContainer.className = "taskItemContainer";

            let checkedTaskDiv = document.createElement("div");
            checkedTaskDiv.className = "checkedTaskDiv";

            let checkedTask = document.createElement("img");
            checkedTask.src = "../assets/unselected.svg";
            checkedTask.className = "checkedTask";

            checkedTaskDiv.appendChild(checkedTask);

            let taskDiv = document.createElement("div");
            taskDiv.className = "taskDiv";


            let taskIdNo = document.createElement("p");
            taskIdNo.textContent = task.id;
            taskIdNo.style.display = "none"
            taskIdNo.className = "taskIdNo";


            let title = document.createElement("h3");
            title.textContent = task.task_name;
            title.className = "taskTitle";

            let desc = document.createElement("p");
            desc.textContent = task.Description;
            desc.className = "descOfTask";

            let date = document.createElement("h5");
            date.textContent = "Due date: " + task.due_date;
            date.className = "dateOfTask";

            
            let editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "editTaskBtn";           

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "deleteTaskBtn";
            

            deleteBtn.addEventListener("click", (e)=> {
                e.preventDefault();
                let getTaskId = taskDiv.querySelector(".taskIdNo").textContent;
                // let grandParentForDel = deleteBtn.parentNode.parentNode; 

                removeFromUi(e);
                delFromBackend(getTaskId);
            })

            let btnDiv = document.createElement("div");
            btnDiv.className = "btnDiv"
            btnDiv.style.display = "flex"

            btnDiv.appendChild(editBtn);
            btnDiv.appendChild(deleteBtn);

            taskDiv.appendChild(title);
            taskDiv.appendChild(desc);
            taskDiv.appendChild(date);
            taskDiv.appendChild(btnDiv);
            // taskDiv.appendChild(editBtn);
            // taskDiv.appendChild(deleteBtn);
            taskDiv.appendChild(taskIdNo);
            

            taskItemContainer.appendChild(checkedTaskDiv);
            taskItemContainer.appendChild(taskDiv);   

            taskList.appendChild(taskItemContainer);

        });

    })
    .catch(function(err){
        console.log("show error:", err);
    });
}

getAllTask();


});




// remaining tasks:
// edit button function
// change search div button on click
// put edit and del button side by side
// perfect dark mode bg and font color settings and change icon
// get all items upon refresh
// confirm if delte is deleting from backend
