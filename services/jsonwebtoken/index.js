const fs   = require('fs');
const jwt   = require('jsonwebtoken');

var privateKEY  = fs.readFileSync(__dirname + '/jwt-private.key', 'utf8');

module.exports = {
    options: { 
        expiresIn: "12h"
    },
    createToken: (data) => {
        if (!data) return null;
        try {
            let token = jwt.sign(data, privateKEY, {expiresIn: "12h"});
            return token;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    validateToken: (token) => {
        if (!token) return null;
        try {
            let result = jwt.verify(token, privateKEY, {expiresIn: "12h"});
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    decodeToken: (token) => {
        if (!token) return null;
        try {
            let data =  jwt.decode(token);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
};