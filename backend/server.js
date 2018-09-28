const express = require('express')
const app = express()
var mongoose = require('mongoose');
const port = 3000

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Conecting to database
mongoose.connect('mongodb://user:user123@ds215563.mlab.com:15563/qunabu-junior-recruitment-task', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var taskSchema = new mongoose.Schema({
  isDone: Boolean,
  contents: String
});

var Task = mongoose.model('Task', taskSchema);

app.use('/to-do-list/frontend', express.static('frontend'))

app.get('/to-do-list/backend/tasks', function (req, res, next) {
  Task.find().lean().exec(function (err, tasks) {
    if (err) return console.error(err);
    return res.end(JSON.stringify(tasks));
  })
})

app.get('/to-do-list/backend', function (req, re, next) {
  res.send('Server Running!')
})


app.listen(port, () => console.log(`Back-End server on port ${port}`))