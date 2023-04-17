const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const pool = new pg.Pool({
  user: 'user123',
  host: 'db',
  database: 'db123',
  password: 'password123',
  port: 5432,
});

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  pool.query('SELECT * FROM todos', (error, results) => {
    if (error) {
      console.error('Error retrieving todos:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(results.rows);
  });
});

app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING id', [title], (error, results) => {
    if (error) {
      console.error('Error adding todo:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const id = results.rows[0].id;
    res.status(201).json({ id, title, completed: false });
  });
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { completed } = req.body;
  if (completed === undefined) {
    res.status(400).json({ error: 'Completed field is required' });
    return;
  }
  pool.query('UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id', [completed, id], (error, results) => {
    if (error) {
      console.error('Error modifying todo:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.rowCount === 0) {
      res.status(404).json({ error: `Todo item with ID ${id} not found` });
      return;
    }
    res.status(200).json({ id, completed });
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM todos WHERE id = $1 RETURNING id', [id], (error, results) => {
    if (error) {
      console.error('Error deleting todo:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.rowCount === 0) {
      res.status(404).json({ error: `Todo item with ID ${id} not found` });
      return;
    }
    res.status(200).json({ id });
  });
});

//app.listen(3000, () => {
//  console.log('Todo API listening on port 3000');
//});


const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => console.log(`Listening on port ${port}...`));

