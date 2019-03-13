let express = require('express');

const multer = require('multer');

const ejs = require('ejs');

const path = require('path');

let bodyParser = require('body-parser');

let Mongoose = require('mongoose')

let app = express();

const port = process.env.PORT || 3000;


Mongoose.connect("mongodb://localhost/books", (err, db) => {
  if (err) {
    return console.log('Unable to Connect');
  }
  console.log('Connected');
});

const bookSchema = Mongoose.model("bookList", {
  title: String,
  author: String,
  publisher: String,
  photo_path: String
});

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +
      path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('bookImage');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.use(function check(error, req, res, next) {
  connection.connect(function(error) {
    if (error) {
      res.writeHead(500, {
        'content-Type': 'text/plain'
      });
      res.end('500 Server Error, Something went wrong with the connection');
      console.log('Unexpected Connection problem ');
      connection.end();
    } else {
      console.log('Error in the query');
      res.writeHead(400, {
        'content-Type': 'text/plain'
      });
      res.end('400 Bad Request, Please check your query again');
      connection.end();
    }
  });
  next();
});

app.get('/book', function(req, res, next) {
  console.log('request was made: ' + req.url);
  bookSchema.find({}, function(error, data) {
    if (error) {
      next(error);
      return;
    } else {
      console.log('Successful query');
      //res.json('bookList');
      res.render('start', { data: data });
    }
  });
});

app.get('/book/Add', function(req, res, next) {
  res.render('index');
});

app.get('/book/BookSummary/:title', function(req, res, next) {
  bookSchema.find({ title: req.params.title }, function(error, result) {
    if (error) {
      next(error);
      return;
    } else {
  console.log(result);
  res.render('BookSummary', { data: result });
   }
 });
});

app.post('/upload', function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      res.render('index', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error: No file Selected !'
        });
      } else {
        let newBook = new bookSchema();

        newBook.title = req.body.book_name
        newBook.author = req.body.author_name;
        newBook.publisher = req.body.publisher_name;
        newBook.photo_path = req.file ? req.file.filename : 'default.png';

        newBook.save(function(error, data) {
          if (error) {
            next(error);
            return;
          } else {
            console.log('Successful query');
            bookSchema.find({}, function(error, data) {
              if (error) {
                next(error);
                return;
              } else {
                console.log('Successful query');
                res.render('start', { data: data });
              }
            });
          }
        });
      }
    }
  });
});

app.listen(port);
