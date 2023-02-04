console.log("Radhey");

// Todo
/**
 * Work on sorting the list and re rendering it
 * work on clear completed button
 * and styles
 *
 */

const dummyTodos = [
	{ id: "4555454865463", task: "Chant Radhey Krsna", isCompleted: false },
	{ id: "4234242342342", task: "Paint some picture", isCompleted: true },
	{ id: "2342342342342", task: "Code some website", isCompleted: false },
	{ id: "2342312222342", task: "Eat", isCompleted: false },
	{ id: "2342341242342", task: "Wash Cloths", isCompleted: false },
];

class Todo {
	constructor(task) {
		this.id = (Math.floor(Math.random() * 1000) + Date.now()).toString();
		this.task = task;
		this.isCompleted = false;
	}
}
/**
 * @type {Todo[]} todos
 */

let todos = [...JSON.parse(localStorage.getItem("state")).todos];

class Application {
	/**
	 * @param {HTMLDivElement} todoHolder
	 */
	constructor(todoHolder) {
		this.todoHolder = todoHolder;

		this.state = JSON.parse(localStorage.getItem("state")) || {
			theme: "DARK",
			currentMode: "ALL",
			todos,
		};
	}
	/**
	 * @param {Todo[]} todos
	 */
	render(todos) {
		this.clear();
		todos.forEach((todo) => {
			todoHolder.appendChild(createTodoDiv(todo));
		});
	}
	clear() {
		while (todoHolder.firstChild) todoHolder.firstChild.remove();
	}

	changeTheme(e) {
		console.log("changeTheme");
		if (this.state.theme === "DARK") {
			this.state.theme = "LIGHT";

			document.documentElement.classList = "light-mode";
			e.target.src = "./assets/images/icon-moon.svg";
		} else if (this.state.theme === "LIGHT") {
			this.state.theme = "DARK";
			document.documentElement.classList = "dark-mode";
			e.target.src = "./assets/images/icon-sun.svg";
		}
		this.save();
	}

	save() {
		this.state.todos = todos;
		localStorage.setItem("state", JSON.stringify(this.state));
	}
}

const todoHolder = $("[data-todo-holder]");

const app = new Application(todoHolder);

const themeSwitcher = $("[data-theme-switcher]");
themeSwitcher.addEventListener("click", (e) => app.changeTheme(e));

/**
 * @type {HTMLInputElement} todoInput
 */
const todoInput = $("[data-todo-input]");
todoInput.addEventListener("keydown", handleTodoInput);

const clearCompletedButton = $("[data-clear-completed]");
clearCompletedButton.addEventListener("click", () => {
	todos = todos.filter((todo) => !todo.isCompleted);
	app.render(todos);
	app.save();
});

// Functions
function handleTodoInput(e) {
	if (e.key === "Enter") {
		if (e.target.value === "") return;

		const newTodo = new Todo(e.target.value);
		const newTodoDiv = createTodoDiv(newTodo);

		todos.push(newTodo);

		todoHolder.appendChild(newTodoDiv);
		calculateLeftItemsAndDisplay();
		e.target.value = "";

		app.save();

		console.log(todos);
	}
}

function createTodoDiv({ task, id, isCompleted }) {
	const newTodoDiv = document.createElement("div");
	newTodoDiv.classList.add("todo");
	newTodoDiv.setAttribute("data-todo", "");
	newTodoDiv.setAttribute("data-todo-id", id);
	newTodoDiv.draggable = true;

	const newInputCheckbox = document.createElement("input");
	newInputCheckbox.type = "checkbox";
	newInputCheckbox.checked = isCompleted;
	newInputCheckbox.setAttribute("data-checkbox", "");

	const newP = document.createElement("p");
	newP.appendChild(document.createTextNode(task));

	const span = document.createElement("span");
	span.setAttribute("data-delete-todo", "");

	const img = document.createElement("img");
	img.src = "./assets/images/icon-cross.svg";

	span.appendChild(img);

	[newInputCheckbox, newP, span].forEach((item) =>
		newTodoDiv.appendChild(item)
	);

	newTodoDiv
		.querySelector("span")
		.addEventListener("click", handleTodoDeletion);

	newTodoDiv
		.querySelector("input")
		.addEventListener("change", handleTodoCompletionChange);
	return newTodoDiv;
}

function handleTodoCompletionChange(e) {
	const parent = e.target.parentElement;
	const id = parent.getAttribute("data-todo-id");
	todos.forEach((todo) => {
		if (todo.id === id) {
			todo.isCompleted = e.target.checked;
		}
	});

	calculateLeftItemsAndDisplay();
	app.save();
}

function handleTodoDeletion(e) {
	/**
	 * @type {HTMLDivElement} parenTodoDiv
	 */
	const parentTodoDiv = e.target.parentElement.parentElement;

	todos = todos.filter(
		(todo) => todo.id !== parentTodoDiv.getAttribute("data-todo-id")
	);
	console.log(todos);

	parentTodoDiv.remove();

	calculateLeftItemsAndDisplay();

	app.save();
}

// UI

let sortingMenu = $("[data-sorter]");
let currentSortMode = getCurrentSortingMode(sortingMenu);

sortingMenu.querySelectorAll("li").forEach((sorter) => {
	sorter.addEventListener("click", todoSorterHandler);
});

function todoSorterHandler(e) {
	if (e.target.classList.contains("active")) return;
	sortingMenu.querySelector(".active").classList.remove("active");
	e.target.classList.add("active");
	currentSortMode = getCurrentSortingMode(sortingMenu);
	app.state.currentMode = currentSortMode;
	app.save();
	if (currentSortMode === "ALL") {
		app.render(todos);
	} else if (currentSortMode === "ACTIVE") {
		app.render(todos.filter((todo) => !todo.isCompleted));
	} else {
		app.render(todos.filter((todo) => todo.isCompleted));
	}
}

function calculateLeftItemsAndDisplay() {
	const leftItems = todos.filter((todo) => !todo.isCompleted).length;

	const leftItemsDisplaySpan = $("[data-left-items]");
	leftItemsDisplaySpan.innerText = `${leftItems} ${
		leftItems === 1 ? " item" : " items"
	}`;
}

function getCurrentSortingMode(sortingMenu) {
	return sortingMenu.querySelector(".active").innerText.toUpperCase();
}

// Display on document load
window.addEventListener("DOMContentLoaded", () => {
	if (app.state.theme === "DARK")
		document.documentElement.className = "dark-mode";
	else if (app.state.theme === "LIGHT")
		document.documentElement.className = "light-mode";
	else if (app.state.theme === "LIGHT") calculateLeftItemsAndDisplay();

	if (app.state.theme === "DARK")
		themeSwitcher.src = "./assets/images/icon-sun.svg";
	else themeSwitcher.src = "./assets/images/icon-moon.svg";

	app.render(todos);
});

/**
 *
 * @param {string} selector
 * @returns {Element[] | null}
 */

function $$(selector) {
	return [...document.querySelectorAll(selector)];
}

/**
 *
 * @param {string} selector
 * @returns {Element | null}
 */
function $(selector) {
	return document.querySelector(selector);
}
