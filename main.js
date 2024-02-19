const express = require("express")
const dotenv = require('dotenv')
const swaggerConfig = require("./src/config/swagger.config")
const {mainRouter} = require('./src/app.routes')
const NotFoundHandler = require('./src/common/exception/not-found.handler')
const AllExceptionHandler = require('./src/common/exception/all-exception.handler')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const expressEjsLayouts = require("express-ejs-layouts")

dotenv.config()

async function main() {
    const app = express()
    const Port = process.env.PORT
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
    require('./src/config/mongoose.config')
    //   معرفی همه جاهایی که فایل های استاتیک ما در آن جا قرار دارد
    app.use(express.static("public"))
    app.set("view engine", "ejs")
    app.set("layouts", "./layouts/panel/main.ejs")
    app.use(expressEjsLayouts)
    app.use(mainRouter)
    swaggerConfig(app)
    NotFoundHandler(app)
    AllExceptionHandler(app)
    app.listen(Port, () => {
        console.log(`server: https://localhost:${Port}`);
    })
}

main()
