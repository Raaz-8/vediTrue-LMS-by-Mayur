require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const Task = require('./models/tasks');
const path = require("path");

const app = express();

const PORT = process.env.PORT || 4000;

// Setup static file serving
const publicStaticDirPath = path.join(__dirname, './public')

// Middleware
app.use(express.static(publicStaticDirPath));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set('view engine', 'ejs');

// Database connection
// const dbURI = process.env.MONGO_URI;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home', { title: 'Home' }));
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard', { title: 'Dashboard' }));
app.get('/courses', requireAuth, (req, res) => res.render('courses', { title: 'Courses' }));
app.get('/coursePage', requireAuth, (req, res) => res.render('coursePage', { title: 'Courses' }));
app.get('/userProfile', requireAuth, (req, res) => res.render('userProfile', { title: 'User Profile' }));

// Task Routes
app.get('/tasks/create', (req, res) => {
  res.render('newTask', { title: 'Create a new Task' });
});

app.get('/tasks', (req, res) => {
  Task.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('tasks', { tasks: result, title: 'All Tasks' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/newTask', (req, res) => {
  const task = new Task(req.body);
  task.save()
    .then(result => {
      res.redirect('/tasks');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then(result => {
      res.render('details', { tasks: result, title: 'Task Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/tasks' });
    })
    .catch(err => {
      console.log(err);
    });
});

// Use Auth Routes
app.use(authRoutes);

// Export for Vercel deployment
module.exports = app;
