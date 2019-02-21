const express = require('express');
const fs = require('fs');
const Author = require('../models/author');
const Book = require('../models/book');
const authorRouter = express.Router();
const multer=require('multer');
const upload=multer({dest:'uploads/'});
const storsge = multer.diskStorage({
    
});
//get all authors
authorRouter.get('/', (req, res) => {
    Author.find().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.send('error in getting data');
    });

});

//add new author
authorRouter.post('/',upload.single('photo') ,(req, res) => {

    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        description: req.body.description
    });
    // if(fs.existsSync('../images/Chuck.jpg')){
        // console.log("assas");
        author.photo.data = fs.readFileSync('home/aya/hhh.png');
        author.photo.contentType = 'image/png';
    // };
    author.save((err) => {
        if (!err) {
            res.send("saved");
        }
    });
});

//get author by id
authorRouter.get('/:id', (req, res) => {
    Author.findById(req.params.id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send('error in getting data');
    });
});
// update author by id
authorRouter.put('/:id', (req, res) => {
    Author.findOneAndUpdate(req.params.id, {
        photo: req.body.photo,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        description: req.body.description
    }).then(() => {
        res.send('updated')
    }).catch((err) => {
        res.send('error in update data' + err);
    });

});
//delete author by id
authorRouter.delete('/:id', (req, res) => {
    Author.findByIdAndRemove(req.params.id).then(() => {
        Book.findByIdAndRemove({ authorId: req.params.id }).then(() => {
            res.send('deleted');
        });
    }).catch(() => {
        res.send('error in delete data ' + err);

    });
});
//get books of specific author 
authorRouter.get('/:id/books', (req, res) => {
    Book.find({ authorId: req.params.id }).then((books) => {
        res.send(books);
    }).catch((err) => {
        res.send('error in getting data ' + err);
    });
});

module.exports = authorRouter;
