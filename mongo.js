// import the dotenv to import environment parameters
require('dotenv').config()

// import mongoose framework
const mongoose = require('mongoose')

// import express server framework
const express = require("express")

// initializes an express server named app
const app = express()

// adds json parser to server
app.use(express.json())

// setup mongo url from env file
const url = process.env.MONGODB_URI

// connect to mongo database
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

// create schema for company
const companySchema = new mongoose.Schema({
    name: String,
    size: Number,
})

const Company = mongoose.model('Company', companySchema)

// route for getting all company resources
app.get('/api/companies', (request, response) => {
    Company.find({}).then(companies => {
        response.json(companies)
    })
})

// route for finding a single company resource
app.get('/api/companies/:id', (request, response) => {
    Company.findById(request.params.id)
        .then(company => {
            if (company) {
                response.json(company)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            response.status(400).send(error.message)
        })
})

// route for creating a single company resource
app.post('/api/companies', (request, response) => {
    // verify the request contains a body
    const body = request.body
    if (!body || body === undefined) {
        // if no body is present, return a 400 response (bad request)
        return response.status(400).json({
            error: "missing body content",
        });
    }

    // if body is found, create the new company object
    const company = new Company({
        name: body.name,
        size: body.size
    })

    // return newly created company as json
    company.save().then(savedCompany => {
        response.json(savedCompany)
    })
})

// route to delete a single company resource
app.delete('/api/companies/:id', (request, response, next) => {
    // find an delete the given company id
    Company.findByIdAndDelete(request.params.id)
        .then(company => {
            if (company) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            response.status(400).send(error.message)
        })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})