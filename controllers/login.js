const express = require("express");
const router = express.Router();

const responseHandler = require("../middlewares/responseHandler");
const { createToken } = require("../services/jsonwebtoken");
const { pickData } = require("../services/main.fns");
const { models } = require("../database/index");
const { User } = models;

router.post("/", async (req, res) => {
    const response = new responseHandler(req, res);

    if (req.isAuthenticated == true) {
        return response
            .assignData("auth", true)
            .setRedirectURI("/senators")
            .setMsg("You are already logged in!", "success")
            .send();
    }

    const { email, password } = req.body;
    if (!(email && password)) {
        return response
            .setMsg("Please supply your valid login credentials[Email & Password]! ", "error")
            .send();
    }

    User
        .login(email, password)
        .then(function(user){
            // Check if username is fund in the database
            if (!user) {
                return response
                    .setMsg("These credentials do not match our records.!", "error")
                    .send();
            }

            // Create authentication token for user
            let user_data = pickData(user, ["id", "email"]);
            let auth_token = createToken(user_data);
            response.assignData("auth_token", auth_token);
                

            return response
                .assignData("auth", true)
                .setRedirectURI("/senators")
                .setMsg("You have been successfully logged in!", "success")
                .send();
        })
        .catch(function(err){
            return response
                .setMsg("Server side error occurred! Please try again later", "error")
                .send();
        });

});
module.exports = router;