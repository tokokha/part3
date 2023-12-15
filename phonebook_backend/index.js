const express = require('express')
var morgan = require('morgan')
const Person = require('./modules/person')

const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({})
      .then(people => {
          response.json(people);
      })
      .catch(error => {
          console.error("Error fetching data:", error.message);
          response.status(500).json({ error: 'Internal Server Error' });
      });
});

app.get('/info', (request, response) => {
    const timestamp = new Date().toString();
    response.send(`<p>phonebook has data for ${Person.length} people</p> <p>${timestamp}</p>`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//   export FLYCTL_INSTALL="/home/tornike/.fly"
//  export PATH="$FLYCTL_INSTALL/bin:$PATH"