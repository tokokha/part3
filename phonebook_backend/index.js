const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

const Person = require('./modules/person')

const errorHandler = (error,request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error:'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


app.get('/api/persons', (request, response) => {
  Person.find({})
      .then(people => {
          response.json(people);
      })
});

app.get('/info', (request, response) => {
  const timestamp = new Date().toString();
  let amount;
  Person.find({}).then(result => response.send(`<p>phonebook has data for ${result.length} people</p> <p>${timestamp}</p>`))
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch(error => next(error))
});


app.post('/api/persons', (request, response, next) => {
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
    response.json(savedPerson).catch(error => next(error))
  })
})
  
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
      console.log(request.params.id)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const opts = { new: true, runValidators: true, context: 'query' }
  
  Person.findByIdAndUpdate(request.params.id, { name, number }, opts)
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//   export FLYCTL_INSTALL="/home/tornike/.fly"
//  export PATH="$FLYCTL_INSTALL/bin:$PATH"