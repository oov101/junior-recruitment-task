document.addEventListener("DOMContentLoaded", (e) => {
  new ToDoApp();
});

/**
 * This is To-Do List Application
 */
class ToDoApp {
  constructor() {
    this.appNode = document.getElementsByClassName('app')[0];
    this.getTasks();
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
   * Render tasks to app container
   * @param {Array} tasks 
   */
  renderTasks(tasks) {
    tasks.forEach(task => {
      this.appNode.appendChild(this.createTaskNode(task._id, task.isDone, task.contents));
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
        <div class="content">${contents}</div>
        <div class="trash"></div>
      </div>
    `;

    return taskNode;
  }
}