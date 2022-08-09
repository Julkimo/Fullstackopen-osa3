//------ Middlewaret ------

const express = require('express')
const app = express()
const morgan = require('morgan')
morgan('tiny')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const { countDocuments } = require('./models/person')

app.use(express.static('build'))

app.use(express.json())

app.use(morgan())

app.use(cors())


//------ Toiminnot ------


app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Phonebook!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            }
            else
            {
                response.status(404).end() //404 not found
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) =>
{
    Person.countDocuments({})
        .then( count => {
            let message = '<h1> Phonebook info </h1>'
            if(count > 0) {
                message += '<p>Phonebook has ' + count + ' people in it</p>'
            } else {
                message += '<p>Phonebook is empty</p>'
            }
            message += '<p>' + new Date() + '</p>'

            response.send(message)
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number)
    {
        return response.status(400).json({
            error: 'name, number or both missing' 
        })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})


//----- Virheenkasittely ------


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})