// import express server framework
const express = require("express");

// initializes an express server named app
const app = express();

// adds json parser to server
app.use(express.json());

// initialize sample company data object
let companies = [
    {
        id: "1",
        name: "Alpha",
        size: 150,
    },
    {
        id: "2",
        name: "Bravo",
        size: 160,
    },
    {
        id: "3",
        name: "Charlie",
        size: 170,
    },
];

// default route displays 'Default Route' header
app.get("/", (request, response) => {
    response.send("<h1>Default route</h1>");
});

// route for getting all company resources
app.get("/api/companies", (request, response) => {
    response.json(companies);
});

// route for getting a single company resource
app.get("/api/companies/:id", (request, response) => {
    // get the id from the request
    const id = request.params.id;

    if (!id) {
        // if id is not present, return a 400 response (bad request)
        return response.status(400).json({
            error: "missing id",
        });
    }

    // find the id in the array and return the associated object
    company = companies.find((company) => company.id == id);

    if (company) {
        // if we find the given id, return the object
        response.json(company);
    } else {
        // if we do not find the given id, return a 404 response (not found)
        response.status(404).end();
    }
});

// route for creating a single company
app.post("/api/companies", (request, response) => {
    // verify the request contains a body
    const body = request.body
    if (!body || body === undefined) {
        // if no body is present, return a 400 response (bad request)
        return response.status(400).json({
            error: "missing body content",
        });
    }
    // if body is found, create the new company object
    let company = body;

    // find the highest id in the companies array
    const companyIds = companies.map((c) => c.id);
    let maxId = Math.max.apply(null, companyIds);

    // add 1 to highest id and assign to company object
    company.id = maxId += 1;

    // concatenate the new company into existing companies array
    companies = companies.concat(company);

    // return newly created company as json
    response.json(company);
});

// route for deleting a single
app.delete("/api/companies/:id", (request, response) => {
    // get the id from the request
    const id = request.params.id;

    if (!id) {
        // if id is not present, return a 400 response (bad request)
        return response.status(400).json({
            error: "missing id",
        });
    }

    // find the id in the array and remove the associated object
    companies = companies.filter((company) => company.id !== id);

    // return a 204 response (no content)
    response.status(204).end();
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
