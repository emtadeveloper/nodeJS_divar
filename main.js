
const express = require("express")
const dotenv = require('dotenv')
const swaggerConfig = require("./src/config/swagger.config")
dotenv.config()

async function main() {
    const app = express()
    const Port = process.env.PORT
    require('./src/config/mongoose.config')
    swaggerConfig(app)
    app.listen(1000, () => {
        console.log(`server: https://localhost:${Port}`);
    })
}
main()
