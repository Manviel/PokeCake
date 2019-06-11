var express = require('express');
var router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  res.send('Review');
});

router.get('/new', (req, res, next) => {
  res.send('New');
});

router.get('/:id', (req, res, next) => {
  res.send('Show');
});

router.get('/:id/edit', (req, res, next) => {
  res.send('Edit');
});

router.post('/', (req, res, next) => {
  res.send('Create');
});

router.put('/:id', (req, res, next) => {
  res.send('Update');
});

router.delete('/:id', (req, res, next) => {
  res.send('Delete');
});

module.exports = router;
