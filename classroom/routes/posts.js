
const express = require('express');
const router = express.Router();

// 
//index Route
router.get('', (req, res) => {
    res.send('Get for posts');
});


//Show Route posts
router.get('/:id', (req, res) => {
    res.send('Get for show  posts id');
});

//Post Route
router.post('/:id', (req, res) => {
    res.send('post for posts ');
});

//Delete
router.delete('/:id', (req, res) => {
    res.send('post for posts');
});

router.post('/:id', (req, res) => {
    res.send('delete for posts');
});