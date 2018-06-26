const express = require('express');

const app = express();

const customers = [
  {id: 1, firstName: 'Mike', lastName: 'Doe'},
  {id: 2, firstName: 'Brad', lastName: 'Traversy'},
  {id: 3, firstName: 'Mary', lastName: 'Swanson'},
];

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.listen(5000, () => `Server running on port 5000`);