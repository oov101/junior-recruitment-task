document.addEventListener("DOMContentLoaded", (e) => {
  new ToDoApp('ToDo List');
});

/**
 * This is To-Do List Application
 */
class ToDoApp {
  constructor() {
    this.initElements();
    this.getTasks();
  }

  /**
   * Initialize necessary DOM Elements
   */
  initElements() {
    this.appNode = document.getElementsByClassName('app')[0];
    this.titleBarTemplate();
    this.tasksContainer = document.createElement('div');
    this.inputBarNode = document.createElement('div');
    this.addTaskNode = document.createElement('div');
    this.taskBarSeparatorNode = document.createElement('div');
    this.inputNode = document.createElement('input');

    this.tasksContainer.setAttribute('class', 'tasks-container');
    this.inputBarNode.classList = 'input-bar task';
    this.addTaskNode.classList = 'add-task';
    this.taskBarSeparatorNode.classList = 'task-bar-separator';

    this.appNode.appendChild(this.tasksContainer);
    this.inputBarNode.append(this.addTaskNode, this.taskBarSeparatorNode, this.inputNode);
    this.appNode.appendChild(this.inputBarNode);

    this.addTaskNode.addEventListener('click', () => this.createNewTask());
  }

  /**
   * HTML Template of title bar
   */
  titleBarTemplate() {
    this.appNode.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-separator"></div>
        <p>ToDo List</p>
      </div>
    `;
  }

  /**
   * fetchTemplate with view rerender
   * @param {String} link 
   * @param {Object} data 
   * @param {String} method 
   */
  fetchTemplate(link, data, method) {
    fetch(`http://localhost:3000/to-do-list/backend/${link}`, {
      method: `${method}`,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error))
      .then(() => this.getTasks());
  }

  /**
   * Render tasks to task container
   * @param {Array} tasks 
   */
  renderTasks(tasks) {
    this.tasksContainer.innerHTML = "";
    tasks.forEach(task => {
      this.tasksContainer.appendChild(this.createTaskNode(task._id, task.isDone, task.contents));
    });
  }

  /**
   * Get tasks from server
   */
  getTasks() {
    fetch('http://localhost:3000/to-do-list/backend/tasks')
      .then(response => response.json())
      .then(tasks => {
        this.renderTasks(tasks);
      });
  }

  /**
  * Validates and creates new task, clears input field after all
  */
  createNewTask() {
    if (this.inputNode.value.length === 0) return;
    const newTask = { isDone: false, contents: this.inputNode.value };
    this.fetchTemplate('new_task', newTask, 'POST');
    this.inputNode.value = "";
  }

  /**
   * Delete task of id
   * @param {Number} id 
   */
  deleteTask(id) {
    this.fetchTemplate(id, undefined, 'DELETE');
  }

  /**
   * Toggle Task between done and todo
   * @param {Number} id 
   * @param {Boolean} isDone 
   */
  toggleTask(id, isDone) {
    this.fetchTemplate(id, { isDone: !isDone }, 'PUT');
  }

  /**
   * Validates and allows to edit tasks
   * @param {Number} id 
   * @param {String} newContents 
   */
  editTask(id, newContents) {
    if (newContents.length === 0) {
      this.getTasks();
      return;
    };
    this.fetchTemplate(id, { contents: newContents }, 'PUT');
  }

  /**
   * Creating a task. Adding proper id, classes and contents for single task.
   * @param {Number} id 
   * @param {Boolean} isDone 
   * @param {String} contents
   * @return {Element}
   */
  createTaskNode(id, isDone, contents) {
    const taskNode = document.createElement('div');
    const checkerNode = document.createElement('div');
    const taskBarSeparatorNode = document.createElement('div');
    const taskContentsContainerNode = document.createElement('div');
    const taskContentsNode = document.createElement('p');
    const trashNode = document.createElement('div');
    let taskStatusClass = '';

    if (isDone) {
      taskStatusClass = 'done';
    }

    /**
     * Append Elements to proper parents
     */
    const moveTaskElementsDOM = () => {
      taskNode.append(checkerNode, taskBarSeparatorNode, taskContentsContainerNode, trashNode);
      taskContentsContainerNode.appendChild(taskContentsNode);
    }

    /**
     * Setting id's and classes to elements
     */
    const setAttributesToTaskElements = () => {
      taskNode.setAttribute('id', `${id}`);
      taskContentsNode.setAttribute('contenteditable', 'true');
      taskNode.className = `task ${taskStatusClass}`;
      checkerNode.className = 'checker';
      taskBarSeparatorNode.className = 'task-bar-separator';
      taskContentsContainerNode.className = 'content';
      trashNode.className = 'trash';
    }

    /**
     * Adding event listeners for toggling, editing, deleting tasks
     */
    const addEventListenersToTaskElements = () => {
      taskContentsNode.addEventListener('focusout', () => this.editTask(id, taskContentsNode.innerText));
      checkerNode.addEventListener('click', () => this.toggleTask(id, isDone));
      trashNode.addEventListener('click', () => this.deleteTask(id));
    };

    moveTaskElementsDOM();
    setAttributesToTaskElements();
    addEventListenersToTaskElements();

    taskContentsNode.innerHTML = contents;

    return taskNode;
  }
}