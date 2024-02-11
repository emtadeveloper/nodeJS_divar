const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

//http://localhost:2000/swagger/
function swaggerConfig(app) {
    console.log('init swagger');
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info: {
                title: 'backend',
                description: ' nodejs course',
                version: '1.0.0',
                contact: {
                    name: "emad Ta",
                    url: "https://freerealapi.com",
                    email: "erfanyousefi.co@gmail.com",
                },
            },
        },
        apis: [process.cwd() + "/src/modules/**/*.swagger.js"]
    })
    const swagger = swaggerUi.setup(swaggerDocument, {explorer: true})
    app.use('/swagger', swaggerUi.serve, swagger)
}

module.exports = swaggerConfig