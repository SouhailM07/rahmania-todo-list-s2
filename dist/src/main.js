//  HTML selectors
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterAllBtn = document.getElementById("filterAll");
const filterActiveBtn = document.getElementById("filterActive");
const filterCompletedBtn = document.getElementById("filterCompleted");
//
let tasks = [];
let currentFilter = "all";
/*=============================================================================================*/
// initialize the app handlers
/*=============================================================================================*/
function init() {
    loadTasks();
    renderTasks();
    setupEventListeners();
}
/*=============================================================================================*/
// loading tasks from localStorage
/*=============================================================================================*/
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks).map((task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
        }));
    }
}
/*=============================================================================================*/
// save tasks to localStorage
/*=============================================================================================*/
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
/*=============================================================================================*/
// setup event listeners
/*=============================================================================================*/
function setupEventListeners() {
    addTaskBtn.addEventListener("click", addTask);
    newTaskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter")
            addTask();
    });
    clearCompletedBtn.addEventListener("click", clearCompletedTasks);
    filterAllBtn.addEventListener("click", () => setFilter("all"));
    filterActiveBtn.addEventListener("click", () => setFilter("active"));
    filterCompletedBtn.addEventListener("click", () => setFilter("completed"));
}
// Add a new task
function addTask() {
    const text = newTaskInput.value;
    if (text === "")
        return;
    const newTask = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date(),
    };
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    // reset input after adding a note
    newTaskInput.value = "";
}
/*=============================================================================================*/
// toggle task completion status
/*=============================================================================================*/
function toggleTaskCompletion(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}
/*=============================================================================================*/
// delete a task
/*=============================================================================================*/
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}
/*=============================================================================================*/
// clear all completed tasks
/*=============================================================================================*/
function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
}
/*=============================================================================================*/
// updating the current filter
/*=============================================================================================*/
function setFilter(filter) {
    currentFilter = filter;
    updateFilterButtons();
    renderTasks();
}
/*=============================================================================================*/
// update filter buttons appearance
/*=============================================================================================*/
function updateFilterButtons() {
    const buttons = [
        filterAllBtn,
        filterActiveBtn,
        filterCompletedBtn,
    ];
    buttons.forEach((btn) => {
        btn.classList.remove("bg-indigo-600", "text-white");
        btn.classList.add("bg-gray-200", "hover:bg-gray-300");
    });
    const activeButton = currentFilter === "all"
        ? filterAllBtn
        : currentFilter === "active"
            ? filterActiveBtn
            : filterCompletedBtn;
    activeButton.classList.remove("bg-gray-200", "hover:bg-gray-300");
    activeButton.classList.add("bg-indigo-600", "text-white");
}
/*=============================================================================================*/
// render tasks based on current filter
/*=============================================================================================*/
function renderTasks() {
    const filteredTasks = tasks.filter((task) => {
        if (currentFilter === "all")
            return true;
        if (currentFilter === "active")
            return !task.completed;
        return task.completed;
    });
    taskList.innerHTML = "";
    filteredTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = `flex items-center justify-between p-3 mb-2 rounded-lg border border-gray-200 ${task.completed ? "bg-gray-50" : "bg-white"}`;
        taskItem.innerHTML = `
            <div class="flex items-center">
                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""}
                    class="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-3 cursor-pointer"
                >
                <span class="${task.completed
            ? "line-through text-gray-400"
            : "text-gray-800"}">
                    ${task.text}
                </span>
            </div>
            <button class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        `;
        const checkbox = taskItem.querySelector("input");
        const deleteBtn = taskItem.querySelector("button");
        checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));
        deleteBtn.addEventListener("click", () => deleteTask(task.id));
        taskList.appendChild(taskItem);
    });
    const activeTasksCount = tasks.filter((task) => !task.completed).length;
    taskCounter.textContent = `${activeTasksCount} active tasks`;
    const hasCompletedTasks = tasks.some((task) => task.completed);
    clearCompletedBtn.style.display = hasCompletedTasks ? "block" : "none";
}
// starting the app here
init();
export {};
