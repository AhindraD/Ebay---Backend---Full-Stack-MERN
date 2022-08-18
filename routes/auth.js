//const { request, response } = require('express');
const express = require('express');

const router = express.Router();

router.post('/signup', (request, response) => {
    console.log('SIGN Up request received!', request.body);
    response.send('Under Construction!')
})

module.exports = router;