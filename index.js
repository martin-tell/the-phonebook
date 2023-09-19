const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
    const requestBody = JSON.stringify(req.body);
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.req(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      requestBody
    ].join(' ');
}));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "1234567890"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "1234567891"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "1234567892",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "1234567893",
    }
]

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }

    repeated = persons.find(person => person.name === body.name)
    if(repeated){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    res.status(201).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
