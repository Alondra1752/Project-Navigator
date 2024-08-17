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
    uniquetaskId = taskId;
    return uniquetaskId;  
}


// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $('div></div').addClass('task-card').attr('id', 'task-' + task.id);
    let taskTitle = $('<h3></h3>').text(task.description);
    let taskDueDate= $('p></p>').text('Due Date: ' + task.dueDate);
    let deleteButton= $('<button></button>').addClass('btn btn-danger').text('Delete').on('click', handleDeleteTask);

    taskCard.append(taskTitle, taskDescription, taskDueDate, deleteButton);
    taskCard.draggable({
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

    // this makes the cards draggable 
    $(".draggable").draggable({
        opacity: 0.7,
        zIndex: 100,
    });

}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
        event.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        
        if (title && description && dueDate) {
            const newTask = {
                id: generateTaskId(),
                title: title,
                description: description,
                dueDate: dueDate
            };
            
            taskList = taskList || [];
            taskList.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(taskList));
            
            renderTaskList();
            
            // Clear the form fields
            document.getElementById('task-title').value = '';
            document.getElementById('task-description').value = '';
            document.getElementById('task-due-date').value = '';
        }
    }
    

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
       const taskId = $(this).attr("data-task-id");
       const taskList = readLocalStorage();

       taskList.forEach((task) => {
        if (task.id === taskId) {
            taskList.splice(taskList.indexOf(task), 1);
        }
       });


    


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
        const taskId = parseInt(ui.helper[0].dataset.id, 10);
        const targetLane = $(event.target).data('lane'); // Assume lanes have data-lane attributes
        
        // Update the task's status or lane here
        const task = taskList.find(task => task.id === taskId);
        if (task) {
            task.status = targetLane;
            localStorage.setItem("tasks", JSON.stringify(taskList));
            renderTaskList();
        }
    }
    

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
        renderTaskList();
        
        // Set up event listeners
        $('#add-task-form').on('submit', handleAddTask);
        
        // Initialize date picker
        $('#task-due-date').datepicker();
    
        // Make lanes droppable
        $('.task-lane').droppable({
            accept: '.task-card',
            drop: handleDrop
        });
    });
    
