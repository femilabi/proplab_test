const express = require("express");
const router = express.Router();

const { QueryTypes, Op } = require('sequelize');

const responseHandler = require("../middlewares/responseHandler");
const { requireAuth } = require("../middlewares/auth");
const { sequelize } = require("../database/index");
const { Senator } = require("../database/index").models;
const { query } = require("express-validator");

router
    // .use(requireAuth)
    .get("/", async (req, res) => {
        const response = new responseHandler(req, res);

        let where = {
            'id': {
                [Op.gt] : 0
            }
        };

        // filter by state
        if (req?.query?.filter?.state) {
            where['state'] = req.query.filter.state;
        }

        // Construct name search
        if (req?.query?.filter?.name) {
            where['name'] = {
                [Op.like] : `%${req.query.filter.name}%`
            };
        }

        const senators = await Senator.findAll({
            where
        })

        if (senators.length) {
            return response
                .assignData("senators", senators)
                .setMsg("success", "success")
                .send();
        } else {
            return response
                .setMsg("No data matches your query in the records", "error")
                .send();
        }
    });
    
module.exports = router;