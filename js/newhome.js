const popup = document.getElementById('popup')
const addTaskBtn = document.getElementById('firstSectionButton')
const searchArea = document.getElementById('search-area')
const searchInput = document.getElementById('searchInput')
const form = document.getElementById('addTaskPopup')
const taskName = document.getElementById('taskName')
const taskDesc = document.getElementById('taskDesc')
const date = document.getElementById('date')
const time = document.getElementById('time')
const tasksContainer = document.getElementById('taskList')
const emptyTaskPrompt = document.getElementById('emptyTaskPrompt')
const darkModeBtn = document.getElementById('darkModeBtn')
const filterButtons = document.querySelectorAll('.filter');
const searchBtn = document.getElementById('searchBtn')
const searchIcon = document.getElementById('searchIcon')


document.addEventListener('DOMContentLoaded', fetchTasks)

addTaskBtn.addEventListener('click', displayPopup)

function displayPopup(e) {
    e.preventDefault();
    popup.style.display = "flex"
    form.reset();

}

popup.addEventListener('click', closePopup)

function closePopup (e) {
    if (e.target ===popup ) {
        popup.style.display = "none"
    }
}

searchInput.addEventListener('focus', (e) => {
    e.preventDefault();
  searchArea.style.borderColor = "orange";
});

searchInput.addEventListener('blur', (e) => {
    e.preventDefault();
  searchArea.style.borderColor = "#b6b0ab";
});

form.addEventListener('submit', submitTask)

function submitTask (e) {
  e.preventDefault();
  const nameValue = taskName.value.trim();
  const descValue = taskDesc.value.trim();
  const dueDateValue = date.value;
  const dueTimeValue = time.value ;


  const convertedDate = new Date(`${dueDateValue}T${dueTimeValue}:00`).toISOString();

  const newTask = {
        task_name: nameValue,
        description: descValue,
        due_date: dueDateValue,
        due_time: convertedDate,
        is_completed: false
  };

  const isEditing = !!todoToEdit;

  const url = isEditing
    ? `https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${todoToEdit.id}`
    : `https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list`;

  const method = isEditing ? 'PUT' : 'POST';
 
  async function saveTodo () {
    try {
      let result = await fetch (url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newTask)
      })

      let data = await result.json()

      if (!result.ok) {
        alert(data.message || 'Something went wrong');
        return;
      }

      form.reset();
      popup.style.display = "none";
      todoToEdit = undefined; 

      fetchTasks()
    }

    catch (err) {
      console.error(err)
    }
  }

  saveTodo();

}

let tasks = [];

let currentFilter = "all";

let isSearching = false;

searchBtn.addEventListener('click', handleSearch);

function handleSearch(e) {
  e.preventDefault();

  let searchQuery = searchInput.value.trim().toLowerCase();

  if (isSearching) {
    cancelSearch();
    return;
  }

  if (searchQuery === "") {
    return;
  }

  isSearching = true;

  updateSearchIcon();

  const searchResults = tasks.filter(task => {
    return (
      task.task_name.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery)
    );
  });

  renderSearchResult(searchResults);
}

function renderSearchResult(searchResults) {
  tasksContainer.querySelectorAll(".taskDiv").forEach(task => task.remove());

  if (searchResults.length === 0) {
    emptyTaskPrompt.style.display = "flex";

    emptyTaskPrompt.innerText = isSearching
      ? "No tasks match your search."
      : "Add task to display.";
    return;
  }

  emptyTaskPrompt.style.display = "none";
  renderTasks(searchResults);
}

function cancelSearch() {
  isSearching = false;
  searchInput.value = "";
  updateSearchIcon();
  applyFilter();
}


function updateSearchIcon() {
  const isDark = document.body.classList.contains("dark");

  if (isSearching) {
    searchIcon.src = isDark
      ? "../assets/lightCloseSearch.svg"
      : "../assets/darkCloseSearch.svg";
  } else {
    searchIcon.src = isDark
      ? "../assets/lightSearch.svg"
      : "../assets/search.svg";
  }
}


filterButtons.forEach(button => {
  button.addEventListener('click', () => {

    filterButtons.forEach(btn => {
      btn.classList.remove('active-filter');
    });

    button.classList.add('active-filter');

    currentFilter = button.innerText.toLowerCase();
    applyFilter();
  });
});

document.querySelector('.filter').classList.add('active-filter');


function applyFilter() {
  if (isSearching) return;

  let filteredTasks = [];

  if (currentFilter === "all") {
    filteredTasks = tasks;
  }

  else if (currentFilter === "active") {
  filteredTasks = tasks.filter(task => {
    const now = new Date();
    const taskTime = new Date(task.due_time);
    return !task.is_completed && taskTime >= now; 
  });
  
}

else if (currentFilter === "missed") {
  filteredTasks = tasks.filter(task => {
    const now = new Date();
    const taskTime = new Date(task.due_time);
    return !task.is_completed && taskTime < now;
  });
}

else if (currentFilter === "completed") {
  filteredTasks = tasks.filter(task => task.is_completed);
}

  renderTasks(filteredTasks);
}

async function fetchTasks (e) {
  try {
    let response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list')
    tasks = await response.json();
    applyFilter();

    return;
   }

  catch(err) {
    console.error(err)
  }
}


function renderTasks(tasks) {

  // remove only rendered tasks (NOT the empty prompt)
  tasksContainer.querySelectorAll('.taskDiv')
    .forEach(task => task.remove());

  if (tasks.length === 0) {
    emptyTaskPrompt.style.display = 'block';
    return;
  }

  emptyTaskPrompt.style.display = 'none';

  tasks.forEach((task) => {

    let taskDiv = document.createElement('div');
    taskDiv.className = 'taskDiv';
    tasksContainer.appendChild(taskDiv);

    let taskCheckbox = document.createElement('input');
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = 'taskCheckbox';
    taskCheckbox.checked = task.is_completed;

    taskCheckbox.addEventListener('change', () => {
      updateTaskCompletion(task, taskCheckbox.checked);
    });

    let taskDetailsDiv = document.createElement('ul');
    taskDetailsDiv.className = 'taskDetailsDiv';

    let taskTitle = document.createElement('li');
    let taskDescription = document.createElement('li');
    let taskTime = document.createElement('li');
    let btnsDiv = document.createElement('div');

    let editBtn = document.createElement('button');
    let delBtn = document.createElement('button');

    editBtn.innerText = 'Edit';
    delBtn.innerText = 'Delete';

    taskTitle.innerText = task.task_name;
    taskDescription.innerText = task.description;

    const dateObj = new Date(task.due_time);
    taskTime.innerText =
      `${dateObj.toDateString().slice(4)} ${dateObj.toTimeString().split(' ')[0]}`;

    taskTitle.className = 'taskTitle';
    taskDescription.className = 'taskDescription';
    taskTime.className = 'taskTime';
    btnsDiv.className = 'btnsDiv';
    editBtn.className = 'editBtn';
    delBtn.className = 'delBtn';

    taskDetailsDiv.append(taskTitle, taskDescription, taskTime, btnsDiv);
    btnsDiv.append(editBtn, delBtn);
    taskDiv.append(taskCheckbox, taskDetailsDiv);

    const now = new Date();
    const taskTimeDate = new Date(task.due_time);

    if (taskTimeDate < now && !task.is_completed) {
      taskTitle.classList.add('missed1');
      taskDescription.classList.add('missed1');
      taskTime.classList.add('missed1');
    }

    if (task.is_completed) {
      taskTitle.classList.add('completedTask');
      taskDescription.classList.add('completedTask');
      taskTime.style.display = 'none';
      editBtn.style.display = 'none';
      delBtn.style.display = 'none';
    }

    editBtn.dataset.id = task.id;
    delBtn.dataset.id = task.id;

    editBtn.addEventListener('click', editTodo);
    delBtn.addEventListener('click', delTodo);
  });
}


async function updateTaskCompletion(task, isCompleted) {
  try {
    const updatedTask = {
      task_name: task.task_name,
      description: task.description,
      due_date: task.due_date,
      due_time: task.due_time,
      is_completed: isCompleted
    };

    const result = await fetch(
      `https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${task.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      }
    );

    if (!result.ok) {
      const data = await result.json();
      console.error("Xano error:", data);
      alert("Failed to update task status");
      return;
    }

    fetchTasks();
  } catch (err) {
    console.error("Completion update error:", err);
  }
}

let todoToEdit;

function editTodo (e) {
  e.preventDefault();
  const id = (e?.target?.dataset.id);
  const todoEdit = tasks.find(t => t.id == id);
  todoToEdit = todoEdit;
  // console.log(todoToEdit)

  displayPopup(e);
  taskName.value = todoToEdit.task_name;
  taskDesc.value = todoToEdit.description;
  date.value = todoToEdit.due_date;
  time.value = todoToEdit.due_time;

  const editDateObj = new Date(todoToEdit.due_time);
  const hours = String(editDateObj.getHours()).padStart(2, '0');
  const minutes = String(editDateObj.getMinutes()).padStart(2, '0');

  time.value = `${hours}:${minutes}`;


}

async function delTodo(e) {
  e.preventDefault();

  const id = e.target.dataset.id;

  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    const result = await fetch(
      `https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await result.json();

    if (!result.ok) {
      alert(data.message || "Failed to delete task");
      return;
    }

    fetchTasks();

    if (todoToEdit && todoToEdit.id == id) {
      todoToEdit = undefined;
      form.reset();
      popup.style.display = "none";
    }

  } catch (err) {
    console.error("Delete error:", err);
  }
}

darkModeBtn.addEventListener ('click', toggleMode)

function toggleMode (e) {
  e.preventDefault();
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");


 darkModeBtn.src = isDark
    ? '../assets/lightmode.svg'   
    : '../assets/Dark mode.svg';

  updateSearchIcon();
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  darkModeBtn.src = '../assets/lightmode.svg'; 

} else {
  darkModeBtn.src = '../assets/Dark mode.svg';

}

updateSearchIcon();

