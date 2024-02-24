const express = require("express")
const dotenv = require('dotenv')
const swaggerConfig = require("./src/config/swagger.config")
const {mainRouter} = require('./src/app.routes')
const NotFoundHandler = require('./src/common/exception/not-found.handler')
const AllExceptionHandler = require('./src/common/exception/all-exception.handler')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const methodOverrode = require('method-override')
const expressEjsLayouts = require("express-ejs-layouts")
const moment = require("jalali-moment");

dotenv.config()

async function main() {
    const app = express()
    const Port = process.env.PORT
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
    app.use(methodOverrode("_method"))
    require('./src/config/mongoose.config')
    //   معرفی همه جاهایی که فایل های استاتیک ما در آن جا قرار دارد
    app.use(express.static("public"))
    app.set("view engine", "ejs")
    app.set("layout", "./layouts/panel/main.ejs")
    app.set("layout extractScripts", true);
    app.set("layout extractStyles", true);
    app.use(expressEjsLayouts)
    app.use(mainRouter)
    // با استفاده از آن میتوانیم یکسری فایل ها یا پراپرتی هایی رو ست کنیم که در داخل فایل های ejs امون بهش دسترسی داشته باشیم
    app.locals.moment = moment
    swaggerConfig(app)
    NotFoundHandler(app)
    AllExceptionHandler(app)
    app.listen(Port, () => {
        console.log(`server: https://localhost:${Port}`);
    })
}

main()
