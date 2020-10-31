const BODY_409 = {
    statusCode: 409,
    error: "Conflict",
    message: 'child "profile" fails because [child "applications" fails because ["applications" is required]]',
};
module.exports = function (self = {}) {
    
    self.update = (clientId, mac, body) => {
        if (clientId !== '12345abc') {
            const err = new Error(`profile of client ${clientId} does not exist`);
            err.statusCode = 404;
            err.error = 'Not Found'

            throw err;
        }
        if(!body.profile || !body.profile.applications) {
            const err = new Error('child "profile" fails because [child "applications" fails because ["applications" is required]]')
            err.statusCode = 409;
            err.error = 'Conflict';

            throw err;
        }
        return body;
    }

    return self;
} 
