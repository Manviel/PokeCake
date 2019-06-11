var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res, next) => {
  res.send('Register');
});

router.get('/login', (req, res, next) => {
  res.send('Log in');
});

router.get('/profile', (req, res, next) => {
  res.send('Profile');
});

router.get('/password', (req, res, next) => {
  res.send('Forgot password');
});

router.get('/reset/:token', (req, res, next) => {
  res.send('Reset password');
});

router.post('/register', (req, res, next) => {
  res.send('Create');
});

router.post('/login', (req, res, next) => {
  res.send('Create');
});

router.put('/profile/:uid', (req, res, next) => {
  res.send('Update');
});

router.put('/password', (req, res, next) => {
  res.send('Forgot password');
});

router.put('/reset/:token', (req, res, next) => {
  res.send('Reset password');
});

module.exports = router;
