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

let todos = [...dummyTodos];

const todoHolder = $("[data-todo-holder]");

/**
 * @type {HTMLInputElement} todoInput
 */
const todoInput = $("[data-todo-input]");
todoInput.addEventListener("keydown", handleTodoInput);

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
		console.log(todos);
	}
}

function createTodoDiv({ task, id, isCompleted }) {
	const newTodoDiv = document.createElement("div");
	newTodoDiv.classList.add("todo");
	newTodoDiv.setAttribute("data-todo", "");
	newTodoDiv.setAttribute("data-todo-id", id);

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
}

// UI

let sortingMenu = $("[data-sorter]");
let currentSortMode = getCurrentSortingMode(sortingMenu);

sortingMenu.querySelectorAll("li").forEach((sorter) => {
	sorter.addEventListener("click", (e) => {
		if (e.target.classList.contains("active")) return;
		sortingMenu.querySelector(".active").classList.remove("active");
		e.target.classList.add("active");
		currentSortMode = getCurrentSortingMode(sortingMenu);
	});
});

function calculateLeftItemsAndDisplay() {
	const leftItems = todos.reduce((sum, todo) => {
		if (!todo.isCompleted) return sum + 1;
		else return sum + 0;
	}, 0);

	const leftItemsDisplaySpan = $("[data-left-items]");
	leftItemsDisplaySpan.innerText = leftItems;
}

function getCurrentSortingMode(sortingMenu) {
	return sortingMenu.querySelector(".active").innerText.toUpperCase();
}

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

window.addEventListener("DOMContentLoaded", () => {
	calculateLeftItemsAndDisplay();
	todos.forEach((todo) => {
		todoHolder.appendChild(createTodoDiv(todo));
	});
});
