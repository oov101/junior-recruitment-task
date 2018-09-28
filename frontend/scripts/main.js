document.addEventListener("DOMContentLoaded", (e) => {
  new ToDoApp('ToDo List');
});

/**
 * This is To-Do List Application
 */
class ToDoApp {
  constructor(title) {
    this.appNode = document.getElementsByClassName('app')[0];
    this.createTitleBar(title);
    this.tasksContainer = this.createTaskContainer();
    this.createInputBar();
    this.getTasks();
  }

  /**
   * Creates tasks container for all tasks
   * @return {Element}
   */
  createTaskContainer() {
    const tasksContainer = document.createElement('div');
    tasksContainer.setAttribute('class', 'tasks-container');
    this.appNode.appendChild(tasksContainer);
    return tasksContainer;
  }

  /**
   * Create title bar for to-do list
   * @param {String} title 
   */
  createTitleBar(title) {
    this.appNode.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-separator"></div>
        <p>${title}</p>
      </div>
    `;
  }

  /**
   * Create input bar for task adding
   */
  createInputBar() {
    const inputBarNode = document.createElement('div');
    inputBarNode.setAttribute('class', 'input-bar');

    inputBarNode.innerHTML = `
      <div class="task">
        <div class="add-task"></div>
        <div class="task-bar-separator"></div>
        <input type="text" name="taks-contents">
      </div>
    `;

    this.appNode.appendChild(inputBarNode);
  }

  /**
   * Get tasks from server as object from JSON
   */
  getTasks() {
    fetch('http://localhost:3000/to-do-list/backend/tasks')
      .then(response => response.json())
      .then(tasks => {
        this.renderTasks(tasks);
      });
  }

  /**
   * Render tasks to tasks container
   * @param {Array} tasks 
   */
  renderTasks(tasks) {
    tasks.forEach(task => {
      this.tasksContainer.appendChild(this.createTaskNode(task._id, task.isDone, task.contents));
    });
  }

  /**
   * Creating Node for task. Adding proper id, classes and contents for single task.
   * @param {Number} id 
   * @param {Boolean} isDone 
   * @param {String} contents
   * @return {Element}
   */
  createTaskNode(id, isDone, contents) {
    const taskNode = document.createElement('div');
    let taskStatusClass = 'to-do';

    if (isDone) {
      taskStatusClass = 'done';
    }

    taskNode.innerHTML = `
      <div id=${id} class="task ${taskStatusClass}">
        <div class="checker"></div>
        <div class="task-bar-separator"></div>
        <div class="content">
          <p>${contents}</p>
        </div>
        <div class="trash"></div>
      </div>
    `;

    return taskNode;
  }
}