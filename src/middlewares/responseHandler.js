exports.responseHandler = async (req, res, next) => {

res.HandleResponse = (statusCode = 201, message = "Success", data = null) => {

    res.status(statusCode).json({
        message: message, 
        data: data
    });
}
next();
}           