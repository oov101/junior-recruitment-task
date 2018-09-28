document.addEventListener("DOMContentLoaded", (e) => {
  new ToDoApp('ToDo List');
});

/**
 * This is To-Do List Application
 * @param {String} title
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
    const addTaskNode = document.createElement('div');
    const taskBarSeparatorNode = document.createElement('div');
    const inputNode = document.createElement('input');

    inputBarNode.classList = 'input-bar task';
    addTaskNode.classList = 'add-task';
    taskBarSeparatorNode.classList = 'task-bar-separator';

    inputBarNode.append(addTaskNode, taskBarSeparatorNode, inputNode);
    
    addTaskNode.addEventListener('click', () => {
      var data = {isDone: false, contents: inputNode.value};

      fetch('http://localhost:3000/to-do-list/backend/new_task', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error))
      .then(() => this.getTasks());

      inputNode.value = "";
    });

    this.appNode.appendChild(inputBarNode);
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
   * Render tasks to tasks container
   * @param {Array} tasks 
   */
  renderTasks(tasks) {
    this.tasksContainer.innerHTML = "";
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
    let taskStatusClass = '';

    if (isDone) {
      taskStatusClass = 'done';
    }

    const taskNode = document.createElement('div');
    const checkerNode = document.createElement('div');
    const taskBarSeparatorNode = document.createElement('div');
    const taskContentsContainerNode = document.createElement('div');
    const taskContentsNode = document.createElement('p');
    const trashNode = document.createElement('div');

    taskNode.setAttribute('id', `${id}`);
    taskNode.className = `task ${taskStatusClass}`;
    checkerNode.className = 'checker';
    taskBarSeparatorNode.className = 'task-bar-separator';
    taskContentsContainerNode.className = 'content';
    trashNode.className = 'trash';
    taskContentsNode.innerHTML = contents;

    taskNode.append(checkerNode, taskBarSeparatorNode, taskContentsContainerNode, trashNode);
    taskContentsContainerNode.appendChild(taskContentsNode);

    checkerNode.addEventListener('click', () => {
      this.getTasks();
    });

    trashNode.addEventListener('click', () => {
      fetch(`http://localhost:3000/to-do-list/backend/${id}`, {
        method: 'DELETE',
      }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error))
      .then(() => this.getTasks()); 
    });

    return taskNode;
  }
}