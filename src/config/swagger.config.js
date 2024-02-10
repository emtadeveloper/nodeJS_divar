const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

function swaggerConfig(app) {
    console.log('init swagger');
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: 'divar-backend',
                description: 'botostart nodejs course',
                version: '1.0.0',
                contact: {
                    name: "Erfan Yousefi",
                    url: "https://freerealapi.com",
                    email: "erfanyousefi.co@gmail.com",
                  },
            }
        },
        apis: []
    })
    const swagger = swaggerUi.setup(swaggerDocument, {})
    app.use('/', swaggerUi.serve, swagger)
}

module.exports = swaggerConfig