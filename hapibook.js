const multer = require('multer');

const Hapi = require('hapi');

const Joi = require('joi');

const Path = require('path');

const Vision = require('vision');

const Mongoose = require('mongoose')

const Inert = require('inert');

const Handlebars = require('handlebars')

const Ejs = require('ejs')

Mongoose.connect("mongodb://localhost/books", (err, db) => {
  if (err) {
    return console.log('Unable to Connect');
  }
  console.log('Connected');
});

const bookSchema = Mongoose.model("List", {
  title: String,
  author: String,
  publisher: String,
  //photo_path: String
});

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +
      path.extname(file.originalname));
  }
});

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('bookImage');
//
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//
//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

const start = async () => {
  try {
    const server = Hapi.server({
      host: 'localhost',
      port: Number(process.argv[2] || 8080)
    });

await server.register(Vision);
server.views({
    engines: {
      ejs: Ejs
          },
  path: Path.join(__dirname, 'views')
  });

server.route({
  method: "GET",
  path: "/book",
  handler: async (request, h) => {
    try {
     let data = await bookSchema.find().exec();
     return h.view('start', { data: data });
   } catch (error) {
     return h.response(error).code(500);
   }
  }
});

server.route({
  method: "GET",
  path: "/book/Add",
  handler:{
   view: 'index'
 }
});

server.route({
  method: "GET",
  path: "/book/BookSummary/{title}",
  handler: async (request, h) => {
    try {
     let data = await bookSchema.find({ title: req.params.title }).exec();
     return h.view('BookSummary', { data: data });
   } catch (error) {
     return h.response(error).code(500);
   }
  }
});

server.route({
  method: "POST",
  path: "/upload",
  handler: async (request, h) => {
    try {
      let newBook = new bookSchema(request.payload);
      let result = await newBook.save();
      //return h.response(result);
      console.log(result);
      return h.view('start', { data: result });
    } catch (e) {
      return h.response(error).code(500);
    } finally {
    }
  }
});

await server.start();

} catch (error) {
    console.log(error);
  }
}

start();


// app.post('/upload', function(req, res, next) {
//   upload(req, res, function(err) {
//     if (err) {
//       res.render('index', {
//         msg: err
//       });
//     } else {
//       if (req.file == undefined) {
//         res.render('index', {
//           msg: 'Error: No file Selected !'
//         });
//       } else {
//         let newBook = new bookSchema();
//
//         newBook.title = req.body.book_name
//         newBook.author = req.body.author_name;
//         newBook.publisher = req.body.publisher_name;
//         newBook.photo_path = req.file ? req.file.filename : 'default.png';
//
//         newBook.save(function(error, data) {
//           if (error) {
//             next(error);
//             return;
//           } else {
//             console.log('Successful query');
//             bookSchema.find({}, function(error, data) {
//               if (error) {
//                 next(error);
//                 return;
//               } else {
//                 console.log('Successful query');
//                 res.render('start', { data: data });
//               }
//             });
//           }
//         });
//       }
//     }
//   });
// });
//
// app.listen(port);
