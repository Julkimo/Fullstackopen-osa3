const express = require('express')
const app = express()
const morgan = require('morgan')
morgan('tiny')
const cors = require('cors')

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

app.use(morgan())

app.use(cors())

app.use(express.static('build'))

const generateId = () => {
    return Math.round(Math.random() * 10000)
}

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Phonebook!</h1>')
})
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number)
    {
        return response.status(400).json({
            error: 'name, number or both missing' 
        })
    }
  
    const person = new Person({
      identity: generateId(),
      name: body.name,
      number: body.number
    })

    // Onko nimi jo listassa-tarkastus myohemmin
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.find({identity: request.params.id}).then(person => {
      response.json(person)
    })
})

app.get('/info', (req, res) =>
{
    const amountOfPeople = persons.length
    const date = new Date()

    let message = '<p>Phonebook has info for ' + amountOfPeople + ' people</p>'
    message += '<p>' + date + '</p>'

    res.send(message)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
