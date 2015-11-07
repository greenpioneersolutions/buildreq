function error(setup) {
    return function errorMiddleware(err, req, res, next) { //Currently just a Sample - Still need to implement
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', {
            error: err
        })
    }
}
module.exports = error;