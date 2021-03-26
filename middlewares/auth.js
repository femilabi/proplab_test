const responseHandler = require("./responseHandler");
const { models } = require("../database/index");
const { validateToken } = require("../services/jsonwebtoken/index");

module.exports = {
    checkAuth: async function (req, res, next) {
        let uid = '';
        let token = (req?.headers?.authorization ? req.headers.authorization.split(" ")[1] : "");
        let token_data = validateToken(token);
        if (token_data) uid = token_data.id;
        
        if (uid) req.User = await models.User.findByPk(uid);

        req.isAuthenticated = req?.User?.id ? true : false;
        next();
    },

    requireAuth: async function (req, res, next) {
        const response = new responseHandler(req, res);

        if (!(
            req.User 
            && req.User instanceof models.User 
            && req.isAuthenticated
        )) {
            return response
                .assignData("auth", false)
                .setRedirectURI("/login")
                .setMsg("Authentication failed! Please login to continue request.", "error")
                .send();
        }
        next();
    }
}