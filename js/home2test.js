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

// NEW SECTION: track which task is being edited
let editingTaskId = null;
// --------------------------------------------------


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
function applyDarkMode() {
    body.style.backgroundColor = "#1a1919ff";
    body.style.color = "white";
    addTaskPopup.style.backgroundColor = "#1a1919ff";
    darkModeBtn.src = "../assets/light mode.svg";
    notification.src = "../assets/white notification.svg";
    searchIcon.src = "../assets/white search.svg"

    filterButtons.forEach(function(btn){
        btn.style.all= "unset";
        btn.style.color = "white";
    });
}

// for light mode
function applyLightMode() {

    body.style.backgroundColor = "white";
    body.style.color = "black";
    darkModeBtn.src = "../assets/Dark mode.svg";
    notification.src = "../assets/Notification.svg";
    searchIcon.src = "../assets/search.svg"

    filterButtons.forEach(function(btn){
        btn.style.all= "unset";
        btn.style.color = "black";
    });
}


// 2. activate add task card

activateAddTask.addEventListener('click', displayAddTask)

function displayAddTask (e) {
    e.preventDefault();

    // NEW: reset editing state
    editingTaskId = null;

    addTaskBtn.textContent = "Add Task";

    popup.style.display = "flex"
}

popup.addEventListener("click", closeAddTask)
    
function closeAddTask (e) {
    if (e.target === popup) {
        popup.style.display = "none";
    }
    else {
        popup.style.display = "flex"
    }
};


// 3. submit task popup (ADD or EDIT)
addTaskPopup.addEventListener('submit', submitTask)

function submitTask (e) {
    e.preventDefault();

    const nameInput = taskName.value;
    const descriptionInput = taskDesc.value;
    const dueDateInput= date.value;
    const dueTimeInput = time.value;

    const convertedDate = new Date(dueDateInput + "T" + dueTimeInput + ":00").toISOString();

    const newTaskCreated = {
        task_name: nameInput,
        Description: descriptionInput,
        due_date: dueDateInput,   
        due_time: convertedDate
    };

    // NEW: if editing, PATCH instead of POST
    if (editingTaskId !== null) {

        fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/" + editingTaskId, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTaskCreated)
        })
        .then(function(res){ return res.json(); })
        .then(function(updated){
            console.log("Task updated:", updated);
            renderTask();
        });

    } else {

        // ADD NEW TASK
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTaskCreated)
        })
        .then(function(result){
            return result.json();
        })
        .then(function(info){
            console.log("Task added:", info);   
            renderTask();
        });

    }

    addTaskPopup.reset();  
    popup.style.display = "none";
}


// render to UI
function renderTask () {

    fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list")
    .then(function(result){
        return result.json();
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

            // NEW: Edit functionality
            editBtn.addEventListener("click", function(){
                editingTaskId = task.id;

                addTaskBtn.textContent = "Save Changes";

                taskName.value = task.task_name;
                taskDesc.value = task.Description;
                date.value = task.due_date;

                let timeOnly = task.due_time.slice(11, 16);
                time.value = timeOnly;

                popup.style.display = "flex";
            });

            // NEW: DELETE functionality
            deleteBtn.addEventListener("click", function(){

                fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/" + task.id, {
                    method: "DELETE"
                })
                .then(function(res){ return res.json(); })
                .then(function(info){
                    console.log("Task deleted:", info);

                    taskItemContainer.remove();  // remove from UI immediately
                });
            });

            taskDiv.appendChild(title);
            taskDiv.appendChild(desc);
            taskDiv.appendChild(date);
            taskDiv.appendChild(editBtn);
            taskDiv.appendChild(deleteBtn);

            taskItemContainer.appendChild(checkedTaskDiv);
            taskItemContainer.appendChild(taskDiv);   

            taskList.appendChild(taskItemContainer);

        });

    })
    .catch(function(err){
        console.log("show error:", err);
    });
}



// change border of filter columns

filterButtons.forEach(function(button){ 
    button.addEventListener('click', filterFunction)
})

function filterFunction (e) {
    e.preventDefault();
    e.target.style.borderColor = "#FF9326";
}
