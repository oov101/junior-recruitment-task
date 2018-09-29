const express = require('express')
var mongoose = require('mongoose');
const app = express()
const port = 3000

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(express.json())
app.use('/to-do-list/frontend', express.static('frontend'))

// Conecting to database
mongoose.connect('mongodb://user:user123@ds215563.mlab.com:15563/qunabu-junior-recruitment-task', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

var taskSchema = new mongoose.Schema({
  isDone: Boolean,
  contents: String
});

var Task = mongoose.model('Task', taskSchema);

app.get('/to-do-list/backend/tasks', function (req, res, next) {
  Task.find().lean().exec(function (err, tasks) {
    if (err) return console.error(err);
    return res.end(JSON.stringify(tasks));
  })
})

app.get('/to-do-list/backend', function (req, re, next) {
  res.send('Server Running!')
})

app.post('/to-do-list/backend/new_task', (req, res, next) => {
  if (!req.body.contents) return;

  const newTask = new Task(req.body);
  newTask.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newTask);
  });
})

app.put('/to-do-list/backend/:task_id', (req, res, next) => {
  if (req.body.contents !== undefined && req.body.contents.length === 0) {
    return;
  };

  Task.findById(req.params.task_id, function (err, task) {
    if (err) return handleError(err);

    task.set(req.body);
    task.save(function (err, updatedTask) {
      if (err) return handleError(err);
      res.send(updatedTask);
    });
  });
})

app.delete('/to-do-list/backend/:task_id', (req, res, next) => {
  Task.findByIdAndRemove(req.params.task_id, (err, task) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Todo successfully deleted",
      id: task._id
    };
    return res.status(200).send(response);
  });
})


app.listen(port, () => console.log(`Back-End server on port ${port}`))