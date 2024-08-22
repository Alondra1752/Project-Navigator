// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const todoList = $("#todo-cards");
const formModal = $("#formModal");

//local storage items
function readLocalStorage() {
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    return taskList;
}

// save the task list 
function saveLocalStorage(taskList) {
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskId = "id" + new Date().getTime();
    return taskId;
      
}


// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $('div></div').addClass('task-card').attr('id', 'task-' + task.id).data('task-id', task.id);
    let taskTitle = $('<h3></h3>').text(task.title);
    let taskDueDate= $('p></p>').text('Due Date: ' + task.dueDate);
    
    taskCard.append(taskTitle, taskDueDate, deleteButton);
    taskCard.addClass('draggable'). draggable({
        revert: "invalid",
        zIndex: 1000
    });

    return taskCard;

    }
    

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskList = readLocalStorage();
    const todoColumn = $("#todo-cards");
    const inProgressColumn = $("#in-progress-cards");
    const doneColumn = $("#done-cards");
    todoColumn.empty();
    inProgressColumn.empty();
    doneColumn.empty();

    for (let i of taskList) {
        if (i.status === "to-do"){
            todoColumn.append(createTaskCard(i));
        } else if (i.status === "in-progress") {
            inProgressColumn.append(createTaskCard(i));
        } else if (i.status === "done") {
            doneColumn.append(createTaskCard(i));
        }

        }
    }

    // this makes the cards draggable 
    $(".draggable").draggable({
        opacity: 0.7,
        zIndex: 100,
    });



// Todo: create a function to handle adding a new task
function handleAddTask(event){
        event.preventDefault();
        
        const title = document.getElementById('task').value;
        const description = document.getElementById('text').value;
        const dueDate = document.getElementById('date').value;
        
        if (title && description && dueDate) {
            const newTask = {
                id: generateTaskId(),
                title: title,
                description: description,
                dueDate: dueDate,
                status: "to-do"
            };
            
            taskList.push(newTask);
            saveLocalStorage(taskList);

            
            renderTaskList();
            
            // Clear the form fields
            document.getElementById('task').value = '';
            document.getElementById('text').value = '';
            document.getElementById('date').value = '';
        }
    }
    

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
       const taskId = $(this).attr("data-task-id");
       const taskList = readLocalStorage();

       taskList.forEach((task) => {
        if (task.id === taskId) {
            taskList.splice(taskList.indexOf(task), 1);
        }
       });

// This saves the projects 
saveLocalStorage(taskList);

}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
        const taskList = readLocalStorage();
        const taskId = ui.draggable.data('task-id');
        const status = event.target.id;

// lopp to update the status of checklist 
for (let task of taskList) {
    if (task.id === taskId) {
        task.status = status;  
        break; // this exits the loop early after finding the task
    }
}
    savelocalStorage.setItem(taskList);
    renderTaskList();
}

    

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();


    formModal.on("submit", handleAddTask);
        renderTaskList();
        
        // Initialize date picker
        $('#task-due-date').datepicker({
            changeMonth: true,
            changeYear: true,
        });

        // Make lanes droppable
        $(".lane").droppable({
            accept: ".draggable",
            drop: handleDrop,
        });
    });

