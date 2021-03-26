const express = require("express");
const router = express.Router();
const app = express();

const responseHandler = require("../middlewares/responseHandler");
const { registerValidator, validate } = require("../middlewares/formValidators");
const { models } = require("../database/index");
const { User } = models;

router
    .post("/", validate(registerValidator(), true), async (req, res) => {
        const response = new responseHandler(req, res);

        let emailExists = await User.findByEmail(req.body.email);
        if (emailExists) {
            return response
                .setMsg("The email you provided has already been used by another user, Please choose a different email to continue.", "error")
                .send();
        }
        
        User
            .build(req.body)
            .save({ fields : ["email", "firstName", "lastName", "password"]})
            .then((user) => {
                if (user) {
                    return response
                        .setRedirectURI("/login")
                        .setMsg("Account registration was successful. You can now login to continue!", "success")
                        .send();
                }
                return response
                    .setMsg("Request failed, server side issue detected. Try again", "error")
                    .send();
            }).catch(function (err) {
                console.log(err);
                return response
                    .setMsg("Server side error occurred, Please try again later", "error")
                    .send();
            });
    });

module.exports = router;