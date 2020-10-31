const authInit = require('./authenticate');
const updateInit = require('./updateAPI');

const BODY_401 = {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'invalid clientId or token supplied',
};
const BODY_404 = {
    statusCode: 404,
    error: 'Not Found',
    message: 'profile of client 823f3161ae4f4495bf0a90c00a7dfbff does not exist',
};
const BODY_409 = {
    statusCode: 409,
    error: "Conflict",
    message: 'child "profile" fails because [child "applications" fails because ["applications" is required]]',
};
const BODY_500 = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
}
const RE = {
    TOKEN: /genToken/,
    PROFILE: /profiles/
}

module.exports = function (self = {}) {
    const auth = authInit();
    const update = updateInit();
    
    self.fetch = async (request) => {
        const { url, headers } = request;
        
        if (RE.TOKEN.test(url)) {
            try {
                const token = auth.genToken(request.headers);
                return {
                    body: token,
                    statusCode: 200,
                }
            } catch (err) {
                throw err;
            }
        }

        if(RE.PROFILE.test(url)){
            const clientMac = url.split('profiles/')[1];
            const mac = clientMac.split(':');
            const clientId = mac.shift();

            try {
                if (auth.isValidToken(headers['x-authentication-token'])) {
                    return {
                        body: update.update(clientId, mac.join(':'), request.body),
                        statusCode: 200
                    }
                } else {
                    const err = new Error(BODY_401.message);
                    err.statusCode = BODY_401.statusCode;
                    err.error = BODY_401.error;

                    throw err;
                }
            } catch (err) {
                throw err;
            }
        }
        const err = Object.assign(new Error(), BODY_404);
        err.message = 'Invalid ULR path';
        throw err;
    };

    return self;
};
