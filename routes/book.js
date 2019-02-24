const express = require('express');
const Book = require('../models/book');
const Category =require('../models/category');
const bookRouter = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//get all books
bookRouter.get('/', (req, res) => {
    Book.find().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.json({ msg: err });
    });

});

//add new book
bookRouter.post('/', upload.single('photo'), (req, res) => {
    const book = new Book({
        photo: req.file.path,
        name: req.body.name,
        categoryId: req.body.categoryId,
        authorId: req.body.authorId,
        rate: req.body.rate
    });
    book.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created book successfully",
        });
    }).catch(err => {
        console.log("err : " + err);
        res.status(500).json({
            error: err
        });
    });
});

//get book by id
bookRouter.get('/:id', (req, res) => {
    Book.findById(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ msg: err });
    });
});

// update book by id
bookRouter.put('/:id', (req, res) => {
    Book.findOneAndUpdate(req.params.id, {
        photo: req.body.photo,
        name: req.body.name,
        categoryId: req.body.categoryId,
        authorId: req.body.authorId,
        rate: req.body.rate
    }).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json({ msg: err });
    });

});

//delete book by id
bookRouter.delete('/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id).then((data) => {
        res.json(data);

    }).catch((err) => {
        res.json({ msg: err });
    });
});

//get books of specific user 
bookRouter.get('/:id/user', (req, res) => {
    Book.find({ userId: req.params.id }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ msg: err });
    });
});

module.exports = bookRouter;