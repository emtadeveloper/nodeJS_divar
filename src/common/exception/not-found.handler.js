const {StatusCodes: HttpStatus} = require("http-status-codes");

function NotFoundHandler(app) {
    app.use((req, res, next) => {
        res.status(HttpStatus.NOT_FOUND).json({
            message: 'NotFound Route'
        })
    })
}

module.exports = NotFoundHandler