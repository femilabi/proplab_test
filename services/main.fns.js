const bcrypt = require("bcrypt");
const crypto = require('crypto');
const CONFIGURATIONS = require("../config/config.prod");

const hashPassword = function (password) {
    return bcrypt.hashSync(
        crypto
            .createHash('sha256')
            .update(password)
            .digest('base64')
    , 10);
}

const verifyPassword = function (password, hash) {
    if (!(password && hash)) return false;
    return bcrypt.compareSync(
        crypto
            .createHash('sha256')
            .update(password)
            .digest('base64')
    , hash, 10);
}

const randomString = function (len = 32) {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

const randomNumbers = function () {
    return Math.floor(100000 + Math.random() * 900000);
}

const getCurrentTime = function() {
    return Math.round((Date.now()/1000));
}

const pickData = function (obj, only_fields) {
    let data = {};
    only_fields.forEach(key => {
        if (obj[key]) data[key] = obj[key];
    });
    return data;
}

const config = (location) => {
    let current_path = CONFIGURATIONS;

    const paths = location.split(".");
    if (!(paths.length > 0)) return '';
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i].toUpperCase();
        if (!(path && current_path[path])) {
            current_path = '';
            break;
        }
        current_path = current_path[path];
    }
    return current_path;
}

module.exports = {
    hashPassword, verifyPassword, randomString, randomNumbers, getCurrentTime, pickData, config
}