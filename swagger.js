const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: ' Bank API',
        description: "A RESTful API for a bank app where users can create account, get a unique account number, deposit money, and transfer money between accounts.",
        contact: {
          name: "Jude Oyedele",
          email: "judeokennywise@gmail.com",
          url: "https://github.com/judekennywise/bankAPI"
        },
        version: '1.0.0',
      },
      servers: [
        {
          url: "https://bank-api-heuw.onrender.com",
          description: "live server"
        },
      ]
    },
    // looks for configuration in specified directories
    apis: ['./routers/*.js'],
  }

const swaggerSpec = swaggerJsdoc(options)
  function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
  }
  module.exports = swaggerDocs;