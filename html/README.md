Project Title: TaskFlow
Developed by: Marvellous Olagoke

# TaskFlow — To-Do List Application 
# About TaskFlow 
TaskFlow  is a simple task management web app that allows users to create, view, delete and update tasks. It had additional features like filter, light/dark mode toggle, search, and delete tasks.  
All tasks are stored using **Xano backend API**.


# TaskFlow Features
# 1. Add New Task
Users can add:
- Task name  
- Description  
- Due date  
- Due time  

Data is sent to Xano through a **POST** request.

# 2. Display All Tasks
All tasks from Xano are shown in the UI with:
- Title  
- Description  
- Due date  
- Completed state  
- Edit & Delete buttons  
- Custom checkbox indicator  

# 3. Delete Tasks
Each task has a *Delete* button that removes it from Xano using:  
`DELETE /todo_list/{id}`

# 4. Mark Task as Completed
Checking the checkbox updates the task’s completed status with:  
`PATCH /todo_list/{id}`

# 5. Filter Tasks
Buttons with class attribute "filter" allow the user to filter tasks by:
- **All**
- **Active** (not completed)
- **Completed**
- **Missed** (past due date)

# 6. Add Task Button
This button displays the task creation form upon click.
Can be opened and closed by clicking outside the form.


##  Technologies Used in Creating TaskFlow:
- HTML5
- CSS3
- JavaScript
- Xano (No-code backend)
- Google Fonts (Space Grotesk)

---

## 📁 Folder Structure
TASKFLOW/
├── assets/
│   ├── arrow.svg
│   ├── Notification.svg
│   ├── Dark mode.svg
│   └── search.svg
├── css/
│   ├── global.css
│   ├── login.css
│   └── home.css
├── html
│   ├── home.html
│   ├── login.html
│   ├── README.md
│   └── signup.html
|
├── js/
│   ├── home.html
│   ├── login.html
│   └── signup.html


## API Endpoints (Xano)
GET:https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list
    https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/{todo_list_id}

POST:https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list

PATCH: https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/{todo_list_id}

DELETE: https://x8ki-letl-twmt.n7.xano.io/api:xqapLxIM/todo_list/{todo_list_id}

### **GET all tasks**
```
GET /todo_list
```

### **POST new task**
```
POST /todo_list
Body:
{
  "task_name": "",
  "Description": "",
  "due_date": "",
  "due_time": ""
}
```

### **PATCH mark task completed**
```
PATCH /todo_list/{id}
Body:
{
  "completed": true/false
}
```

### **DELETE a task**
```
DELETE /todo_list/{id}
```


## 🚀 How to Run the Project
1. Download or clone the repository.  
2. Open the project folder.  
3. Start by opening **signup.html** in your browser (Chrome recommended).  
4. Make sure your Xano API is active — no server setup required.


## 👩‍💻 Developer Notes
This project was built to practice:
- DOM manipulation  
- Working with REST APIs  
- Handling forms  
- Rendering elements dynamically  
- Basic UI/UX layout  



## For recommendations, enquiry, or collaboration, contact me @ olagokemarvellous@gmail.com


