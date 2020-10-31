const csv = require('csv-parser');
const fs = require('fs');

module.exports = function (self = {}) {
    self.read = (path) => {
        if (!path) {
            throw new Error('A .csv file is required for this operation');
        }
        let head = [];
        const payload = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(path)
            .pipe(csv())
            .on('data', (data) => payload.push(data))
            .on('headers', (headers) => head = headers)
            .on('end', () => {
                return resolve({headers: head, payload});
            })
            .on('error', reject);
        });
    };


    return self;
}
