// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId; 
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
        const container = document.getElementById('task-container');
        container.innerHTML = '';
        if (taskList) {
            taskList.forEach(task => {
                const card = createTaskCard(task);
                container.appendChild(card);
            });
        }
        
        // Make the cards draggable
        $('.task-card').draggable({
            revert: true,
            helper: 'clone'
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
        const card = event.target.closest('.task-card');
        const taskId = parseInt(card.dataset.id, 10);
        
        taskList = taskList.filter(task => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        
        renderTaskList();
    }
    


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
    
