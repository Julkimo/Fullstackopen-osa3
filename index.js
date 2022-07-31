const express = require('express')
const app = express()
const morgan = require('morgan')
morgan('tiny')

app.use(express.json())
app.use(morgan())

let persons =
[
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122",
    }
]

app.get('/', (req, res) =>
{
    res.send('<h1>Welcome to the Phonebook!</h1>')
})
  
app.get('/api/persons', (req, res) =>
{
    res.json(persons)
})
  
app.get('/info', (req, res) =>
{
    const amountOfPeople = persons.length
    const date = new Date()

    let message = '<p>Phonebook has info for ' + amountOfPeople + ' people</p>'
    message += '<p>' + date + '</p>'

    res.send(message)
})

app.get('/api/persons/:id', (request, response) =>
{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person)
    {
        response.json(person)
    }
    else
    {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>
{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () =>
{
    return Math.round(Math.random() * 10000)
}

app.post('/api/persons', (request, response) =>
{
    const body = request.body
  
    if (!body.name || !body.number)
    {
        return response.status(400).json({
            error: 'name, number or both missing' 
        })
    }

    if (persons.find(person => person.name === body.name) != null)
    {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
