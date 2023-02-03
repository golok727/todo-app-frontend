console.log("Radhey");

const todoHolder = $("[data-todo-holder]");

/**
 * @type {HTMLInputElement} todoInput
 */
const todoInput = $("[data-todo-input]");

todoInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		if (e.target.value === "") return;
		const newTodo = document.createElement("div");
		newTodo.classList.add("todo");
		newTodo.setAttribute("data-todo", "");
		newTodo.innerHTML = `
    	<input type="checkbox" name="" id=""/>
						<p>${e.target.value}</p>`;
		todoHolder.appendChild(newTodo);
		e.target.value = "";
	}
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
