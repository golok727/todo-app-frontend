console.log("Radhey");

const dummyTodos = [
	{ id: "4555454865463", task: "Chant Radhey Krsna", isCompleted: false },
	{ id: "4234242342342", task: "Paint some picture", isCompleted: true },
	{ id: "2342342342342", task: "Code some website", isCompleted: false },
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
		e.target.value = "";
		console.log(todos);
	}
}

function createTodoDiv({ task, id, isCompleted }) {
	const newTodoDiv = document.createElement("div");
	newTodoDiv.classList.add("todo");
	newTodoDiv.setAttribute("data-todo", "");
	newTodoDiv.setAttribute("data-todo-id", id);

	const newInput = document.createElement("input");
	newInput.type = "checkbox";
	newInput.checked = isCompleted;

	const newP = document.createElement("p");
	newP.appendChild(document.createTextNode(task));

	const span = document.createElement("span");
	span.setAttribute("data-delete-todo", "");

	const img = document.createElement("img");
	img.src = "./assets/images/icon-cross.svg";

	span.appendChild(img);

	[newInput, newP, span].forEach((item) => newTodoDiv.appendChild(item));

	newTodoDiv
		.querySelector("span")
		.addEventListener("click", handleTodoDeletion);
	return newTodoDiv;
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
	todos.forEach((todo) => {
		todoHolder.appendChild(createTodoDiv(todo));
	});
});
