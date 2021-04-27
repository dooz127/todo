const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const todoRoutes = express.Router();
const PORT = 4000;

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './../frontend/public/uploads');
    },
    filename: (req, file, callback) => {
      callback(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter: (req, file, callback) => {
    if (
      !file.originalname.match(/\.(jpeg|jpg|png|gif|pdf|doc|docx|xlsx|xls)$/)
    ) {
      return callback(
        new Error(
          'only upload files with jpg, jpeg, png, gif, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    callback(undefined, true);
  }
});

let Todo = require('./models/Todo');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/').get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route('/update/:id').post(upload.single('file'), (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send('data is not found');

    todo.description = req.body.description;
    todo.dueDate = req.body.dueDate;
    todo.completed = req.body.completed;

    if (req.file) {
      todo.filePath = req.file.path;
      todo.fileType = req.file.mimetype;
    }

    todo
      .save()
      .then((todo) => {
        res.json('Todo updated!');
      })
      .catch((err) => {
        res.status(400).send('Update not possible');
      });
  });
});

todoRoutes.route('/delete/:id').post((req, res) => {
  Todo.findByIdAndDelete(req.params.id, () => {
    res.json('Todo deleted.');
  });
});

todoRoutes.route('/add').post(upload.single('file'), (req, res) => {
  let todo = new Todo({
    description: req.body.description,
    dueDate: req.body.dueDate,
    completed: req.body.completed,
    filePath: req.file ? req.file.path : '',
    fileType: req.file ? req.file.mimetype : ''
  });

  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: 'Todo added successfully' });
    })
    .catch((err) => {
      res.status(400).send('Adding new todo failed');
    });
});

todoRoutes.route('/download/:id').get((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send('data is not found');
    res.set({ 'Content-type': todo.fileType });
    res.sendFile(path.join(__dirname, todo.filePath));
  });
});

app.use('/todos', todoRoutes);

app.use(express.static('./../frontend/build'));

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '..', 'frontend', 'build', 'index.html')
  );
});

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});
