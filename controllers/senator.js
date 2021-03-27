const express = require("express");
const router = express.Router();

const sequelize = require('sequelize');

const responseHandler = require("../middlewares/responseHandler");
const { senatorDataValidator, validate } = require("../middlewares/formValidators");
const { requireAuth } = require("../middlewares/auth");
const { models } = require("../database/index");
const { Senator } = models;

router
    .use(requireAuth)
    .post("/", validate(senatorDataValidator(), true), async (req, res) => {
        const response = new responseHandler(req, res);
        Senator
            .create(req.body)
            .then(function(senator){
                return response
                    .assignData("senator", senator)
                    .setMsg("Record added successfully", "success")
                    .send();
            })
            .catch(function(e){
                return response
                    .setMsg("Request failed. Please fill the required fields and try again.", "error")
                    .send();
            });
    })
    .put("/:id", validate(senatorDataValidator(), true), async (req, res) => {
        const response = new responseHandler(req, res);

        const senator = await Senator.findByPk(req.params.id);
        if (senator) {
            senator
                .update(req.body, ["phoneNumber", "state", "name", "state"])
                .then(function(data){
                    return response
                        .assignData("updatedSenator", data)
                        .setMsg("Data has been successfully updated", "success")
                        .send();
                })
                .catch(function(){
                    return response
                        .setMsg("Update request failed. Please ensure all fields are correctly filled.", "error")
                        .send();
                });
        } else {
            return response
                .setMsg("Specified record not found in the database", "error")
                .send();
        }
    })
    .delete("/:id", async (req, res) => {
        const response = new responseHandler(req, res);

        const senator = await Senator.findByPk(req.params.id);
        if (senator) {
            try {
                await senator.destroy();
                return response
                    .setMsg("Record has been successfully removed.", "success")
                    .send();
            } catch (error) {
                return response
                    .setMsg("Request failed. Please try again", "error")
                    .send();
            }
        } else {
            return response
                .setMsg("Specified record not found in the database.", "error")
                .send();
        }
    });
    
module.exports = router;