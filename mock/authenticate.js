const ONE_MINUTE = 60000;

const BODY_401 = {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'invalid clientId or token supplied',
};

module.exports = function (self = {}) {
    self.genToken = (headers) => {
        const clientId = headers['x-client-id'];
        const secret = headers['x-client-secret'];
        if (clientId === '12345abc' && secret === 'superSecret123') {
            return `mockToken:${new Date().getTime()}`
        } else {
            const err = Object.assign(new Error(), BODY_401);
            err.message = 'invalid clientId or secret supplied'
            throw err;
        }
    }

    self.isValidToken = (token) => {
        const timestamp = Number(token.split(':')[1]);
        const now = new Date();
        
        if(now.getTime() - timestamp < ONE_MINUTE) {
            return true;
        }

        throw Object.assign(new Error(), BODY_401);
    };

    return self;
}
