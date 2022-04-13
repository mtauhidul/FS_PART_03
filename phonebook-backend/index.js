const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());

morgan.token('postData', (request) => {
  if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
  else return ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
);
app.use(cors());
app.use(express.static('build'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/info', (request, response) => {
  const entries = persons.length;
  const time = new Date();

  response.send(`phonebook has info for ${entries} people,  ${time}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    return response.json(person);
  } else {
    return response.status(404).send('id not found');
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id === id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  const numberAvailability = persons.find((p) => p.number === person.number);

  if (person.name && person.number && !numberAvailability) {
    const id = Math.floor(Math.random() * 100);
    person.id = id;
    persons.push(person);
    response.json(person);
  } else {
    response.status(400).send('Number is already registered');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
