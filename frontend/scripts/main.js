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
    this.inputNode.addEventListener('focus', () => this.inputNode.placeholder = '');

    this.regExpNotWordCharNoDigits = /^$|^[\W\d]/;
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
      this.tasksContainer.appendChild(new Task(this, task._id, task.isDone, task.contents).taskNode);
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
    if (this.regExpNotWordCharNoDigits.test(this.inputNode.value)) {
      this.inputNode.placeholder = 'Invalid symbols or empty!';
      return;
    }
    const newTask = { isDone: false, contents: this.inputNode.value };
    this.fetchTemplate('new_task', newTask, 'POST');
    this.inputNode.value = "";
  }

  /**
   * Delete task with exact id
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
  editTask(id, oldContents, newContents) {
    if (oldContents === newContents) return;

    if (this.regExpNotWordCharNoDigits.test(newContents)) {
      this.getTasks();
      return;
    };
    this.fetchTemplate(id, { contents: newContents }, 'PUT');
  }
}

/**
 * Single task
 * @param {ToDoApp} toDoApp
 * @param {Number} id
 * @param {Boolean} isDone
 * @param {String} contents
 */
class Task {
  constructor (toDoApp, id, isDone, contents) {
    this.toDoApp = toDoApp;
    this.id = id;
    this.isDone = isDone;
    this.contents = contents;
    this.init();
    this.moveTaskElementsDOM();
    this.setAttributesToTaskElements();
    this.addEventListenersToTaskElements();
    this.taskContentsNode.innerHTML = contents;
  }

  /**
   * Initialize necessary DOM Elements
   */
  init() {
    this.taskNode = document.createElement('div');
    this.checkerNode = document.createElement('div');
    this.taskBarSeparatorNode = document.createElement('div');
    this.taskContentsContainerNode = document.createElement('div');
    this.taskContentsNode = document.createElement('p');
    this.trashNode = document.createElement('div');
    this.taskStatusClass = '';
  }

  /**
   * Append Elements to proper parents
   */
  moveTaskElementsDOM() {
    this.taskNode.append(this.checkerNode, this.taskBarSeparatorNode, this.taskContentsContainerNode, this.trashNode);
    this.taskContentsContainerNode.appendChild(this.taskContentsNode);
  }

  /**
  * Change task status class to done
  */
  toggleTaskStatus() {
    if (this.isDone) this.taskStatusClass = 'done';
  }

  /**
   * Setting ids and classes to elements
   */
  setAttributesToTaskElements() {
    this.toggleTaskStatus();
    this.taskNode.setAttribute('id', `${this.id}`);
    this.taskContentsNode.setAttribute('contenteditable', 'true');
    this.taskNode.className = `task ${this.taskStatusClass}`;
    this.checkerNode.className = 'checker';
    this.taskBarSeparatorNode.className = 'task-bar-separator';
    this.taskContentsContainerNode.className = 'content';
    this.trashNode.className = 'trash';
  }

  /**
   * Adding event listeners for toggling, editing, deleting tasks
   */
  addEventListenersToTaskElements() {
    this.taskContentsNode.addEventListener('click', () => {
      const oldContents = this.taskContentsNode.innerText; 
      this.taskContentsNode.addEventListener('focusout', () => this.toDoApp.editTask(this.id, oldContents, this.taskContentsNode.innerText));
    });
    this.checkerNode.addEventListener('click', () => this.toDoApp.toggleTask(this.id, this.isDone));
    this.trashNode.addEventListener('click', () => this.toDoApp.deleteTask(this.id));
  };
}