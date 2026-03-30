document.addEventListener("DOMContentLoaded", () => {
const activateAddTask = document.getElementById('firstSectionButton');
const darkModeBtn = document.getElementById("darkModeBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const body = document.body;
const searchArea = document.getElementById("search-area");
const taskList = document.getElementById("taskList");
const popup = document.getElementById("popup");
const addTaskPopup = document.getElementById("addTaskPopup");
const notification = document.getElementById("notification");
const searchIcon = document.getElementById("searchIcon");
const filterButtons = document.querySelectorAll(".filter");


const taskName = document.getElementById("taskName");
const taskDesc = document.getElementById("taskDesc");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");


// show add task popup
activateAddTask.addEventListener('click', displayAddTask);

function displayAddTask(e) {
    e.preventDefault();
    popup.style.display = "flex";
}

popup.addEventListener("click", closeAddTask);

function closeAddTask(e) {
    if (e.target === popup) {
        popup.style.display = "none"
    };
}

// create backend and send data to database haew God epp my life

addTaskPopup.addEventListener('submit', function(e){
    e.preventDefault();

    const nameValue = taskName.value.trim();
    const descValue = taskDesc.value.trim();
    const dueDateValue = dateInput.value;
    const dueTimeValue = timeInput.value;

    const convertedDate = new Date(`${dueDateValue}T${dueTimeValue}:00`).toISOString();

    const newTaskCreated = {
        task_name: nameValue,
        Description: descValue,
        due_date: dueDateValue,
        due_time: convertedDate
    };

    console.log(newTaskCreated)

    fetch('https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list', {
        method: 'POST',
        headers: { 
        "Content-Type": "application/json"
        },
        body: JSON.stringify(newTaskCreated)
    })

    .then(res => res.json())

    .then(info => {
        addTaskPopup.reset();
        popup.style.display = "none";
        getAllTask();
    })

    .catch(err => {
        console.error("Error from add task code:", err);
        alert("Add task failed, retry.");
    });

});


//render task to UI
function renderTask(taskArray) {
    taskList.innerHTML = "";

    if(!Array.isArray(taskArray) || taskArray.length === 0){
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No task here.";
        taskList.appendChild(emptyMsg);
        emptyMsg.setAttribute('class', 'emptyMsg')
        return;
    }

    const now = new Date();

    taskArray.forEach(function(task) {

        const taskItemContainer = document.createElement("div");
        taskItemContainer.className = "taskItemContainer";

        const checkedTaskDiv = document.createElement("div");
        checkedTaskDiv.className = "checkedTaskDiv";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", forCheckbox )

        checkedTaskDiv.appendChild(checkbox);

        const taskDiv = document.createElement("div");
        taskDiv.className = "taskDiv";

        const title = document.createElement("h3");
        title.textContent = task.task_name;
        title.className = "taskTitle";

        const desc = document.createElement("p");
        desc.textContent = task.Description || "";
        desc.className = "descOfTask";

        const dateEl = document.createElement("h5");
        dateEl.textContent = "Due date: " + (task.due_date || "");
        dateEl.className = "dateOfTask";

        // strikethrough completed tasks
        if(task.completed){
            title.style.textDecoration = "line-through";
            desc.style.textDecoration = "line-through";
            dateEl.style.textDecoration = "line-through";
        }

        // check if task missed

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "editTaskBtn";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteTaskBtn";

        deleteBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            fetch(`https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${task.id}`,{
                method:"DELETE",
                headers:{ "Content-Type": "application/json" }
            })
            .then(res => res.json())
            .then(data=>{
                getAllTask();
            })
            .catch(err=>{
                console.error("Delete error:", err);
            });
        });

        const btnDiv = document.createElement("div");
        btnDiv.className = "btnDiv";
        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(deleteBtn);

        taskDiv.appendChild(title);
        taskDiv.appendChild(desc);
        taskDiv.appendChild(dateEl);
        taskDiv.appendChild(btnDiv);

        taskItemContainer.appendChild(checkedTaskDiv);
        taskItemContainer.appendChild(taskDiv);

        taskList.appendChild(taskItemContainer);
    });
}

function forCheckbox (ev) {
            
             fetch(`https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: ev.target.checked })
            })

            .then(res => res.json())

            .then(data=>{getAllTask();})

            .catch(err=>{
                console.error('checkbox function failed:', err);
            });
}

// add functionality to filter buttons

filterButtons.forEach(button=>{
    button.addEventListener('click', function(e){
        e.preventDefault();
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
        const key = button.textContent.trim().toLowerCase();
        getAllTask(key);
    });
});

//change searchbtn color in click input

const searchInput = searchArea.querySelector("input");
const searchBtn = document.getElementById("searchBtn");
searchInput.addEventListener("click", function(e){
    e.preventDefault();
    searchArea.style.border = "2px solid #FF9326";
    const searchTerm = searchInput.value.trim().toLowerCase();
    getAllTask(null, searchTerm);
});


function getAllTask(filterKey = null, searchTerm = ""){
    fetch("https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list")
    .then(res => res.json())
    .then(data=>{
        let tasks = data.slice();

        // display by filter
        if(filterKey){
            if(filterKey.includes("active")) tasks = tasks.filter(t=>!t.completed);
            else if(filterKey.includes("completed")) tasks = tasks.filter(t=>t.completed);
            else if(filterKey.includes("missed")){
                const now = new Date();
                tasks = tasks.filter(t=>{
                    const due = t.due_time ? new Date(t.due_time) : null;
                    return due && !t.completed && due < now;
                });
            }
        }

        renderTask(tasks);
    })
    .catch(err=>{
        console.error("Fetch error:", err);
    });
}

getAllTask();


});
