const ExtendableError = require("./ExtendableError");

class ClientError extends ExtendableError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = ClientError;
