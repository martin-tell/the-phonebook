const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')

const Person = require('./models/person')

app.use(cors()) //This middleware allows other domains to use the resources of the current domain, it is useful for APIS
app.use(express.json()) //JSON request body will be turned into JS objects, POST and PUT requests use this middleware

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

app.use(express.static('build')) //React build code will be the main page, build folder uses this middleware

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(people => {
            res.json(people)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person);
            }else{
                res.status(404).end();
            }
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findOneAndUpdate({ _id: req.params.id }, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'});
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

//Me quede Ejercicios 3.15.-3.18. solo afinar detalles del encabezado /info no carga desde el navegador