class ExpressError extends Error{
    constructor(statusCode){
        super();
        this.statusCode = statusCode;
        this.message = this.message;

    }
}

module.exports = ExpressError;