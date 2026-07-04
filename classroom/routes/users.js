const express = require('express');
const router = express.Router();

//index Route
router.get('/', (req, res) => {
    res.send('Get for ');
});


//Show Route  
router.get('/:id', (req, res) => {
    res.send('Get for show  user id');
});

//Post Route
router.post('/:id', (req, res) => {
    res.send('post for user ');
});

//Delete
router.delete('/:id', (req, res) => {
    res.send('post for ');
});

router.post('/:id', (req, res) => {
    res.send('delete for users');
});

module.exports = router;